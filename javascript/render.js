var renderer;
let composer, shaderTime = 0,
    badTVPass, staticPass, rgbPass, filmPass, renderPass,
    copyPass;
    let targetRotation = new THREE.Vector2();
    let targetScale = 1;
    let currentScale = 1;

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

function init() {
    

    let stats = new Stats();
    //document.body.appendChild(stats.domElement);
    const color = 0x000000;
    let scene = new THREE.Scene();
    scene.fog = new THREE.Fog(color, 0, 150);
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        //alpha: true
    });
    camera.position.z = 80;
    //renderer.autoClear = true;
    //scene.background = null;
    //renderer.setClearColor(new THREE.Color(0x000030, ));

    add3DCoordinateSystem(scene);

    // Listen for messages from the parent page
window.addEventListener('message', (event) => {
    const { type, deltaY } = event.data;

    if (type === 'scroll') {
        const zoomSpeed = 0.1; // Adjust zoom speed
        camera.position.z += deltaY * zoomSpeed * 0.05;
        //camera.position.x += deltaY * zoomSpeed * 0.1;
        //camera.position.y += deltaY * zoomSpeed * 0.05;

       
        camera.position.z = Math.min(Math.max(camera.position.z, 50), 100);
        //camera.position.y = Math.min(Math.max(camera.position.y, 20), 50);
    }
});


// Create a canvas to generate a gradient texture
const gradientCanvas = document.createElement('canvas');
gradientCanvas.width = 3; // Small size for performance; the texture will stretch
gradientCanvas.height = 3;
const gradientContext = gradientCanvas.getContext('2d');


const gradient = gradientContext.createLinearGradient(0, 0, 4, gradientCanvas.height);
gradient.addColorStop(0, '#000030'); 
gradient.addColorStop(1, '#990040'); 



gradientContext.fillStyle = gradient;
gradientContext.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);


const gradientTexture = new THREE.CanvasTexture(gradientCanvas);


scene.background = gradientTexture;
renderer.setSize(window.innerWidth, window.innerHeight);



    //### Postprocessing ###

    //Create Shader Passes
    //renderPass = new THREE.RenderPass(scene, camera);
    /*badTVPass = new ShaderPass(THREE.BadTVShader);
    rgbPass = new ShaderPass(THREE.RGBShiftShader);
    filmPass = new ShaderPass(THREE.FilmShader);
    staticPass = new ShaderPass(THREE.StaticShader);
    copyPass = new ShaderPass(THREE.CopyShader);*/

    //set shader uniforms
    //filmPass.uniforms.grayscale.value = 0;



    /*composer.addPass(renderPass);
    composer.addPass(filmPass);
    composer.addPass(badTVPass);
    composer.addPass(rgbPass);
    //composer.addPass(staticPass);
    composer.addPass(copyPass);
    copyPass.renderToScreen = true;*/

    //### Postprocessing ###

    //const axesHelper = new THREE.AxesHelper(100);
    //scene.add(axesHelper);

    particle = new THREE.Object3D();
    scene.add(particle);

    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load('texture/normalMapMetal6.png');
    const normalTexture2 = textureLoader.load('texture/normalMapMetal7.png');
    //const normalTexture3 = textureLoader.load('texture/normalMapMetal3.png')
    const mapArray = [normalTexture, normalTexture2,/*normalTexture3*/]

    /*const loader = new THREE.GLTFLoader();
    loader.load('3dmodels/mcc95logo.glb', function (gltf){
        const logo = gltf.scene;

        particle.add(logo);
    }, undefined, function (error){
        console.error('An error happened while loading the GLTF:', error);
    });*/
    



    let geometry = new THREE.SphereBufferGeometry(6, 4, 4);

for (let i = 0; i < 200; i++) {
    const randomNormalMap = mapArray[Math.floor(Math.random() * mapArray.length)];
    const randomMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0x000055,
        normalMap: randomNormalMap
    });

    let mesh = new THREE.Mesh(geometry, randomMaterial);

    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(50 + (Math.random() * 65));
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);

    const randomScale = Math.random() * 0.5 + 0.5;
    mesh.scale.set(randomScale, randomScale, randomScale);

    mesh.rotationSpeed = {
        x: Math.random() * 0.02 - 0.01,
        y: Math.random() * 0.02 - 0.01,
        z: Math.random() * 0.02 - 0.01
    };

    particle.add(mesh);
}


const loader = new THREE.GLTFLoader();
loader.load('3dmodels/mcc95logoTest.glb', function (gltf) {
    const logo = gltf.scene;

  
    logo.scale.set(15, 15, 15);
    logo.position.set(0, 0, 0);

    //logo.rotationSpeed = { x: 0.005, y: 0.01, z: 0 };

    particle.add(logo);
}, undefined, function (error) {
    console.error('An error happened while loading the GLTF:', error);
});


    
    let pointLightPink = new THREE.PointLight(0xff0080, 100);
    pointLightPink.position.x = 30;
    pointLightPink.position.y = 20;
    pointLightPink.position.z = 10;
    scene.add(pointLightPink);

    let pointLightGreen = new THREE.PointLight(0x88ff00, 90);
    pointLightGreen.position.x = 20;
    pointLightGreen.position.y = 10;
    pointLightGreen.position.z = 10;
    scene.add(pointLightGreen);

    let pointLightRed = new THREE.PointLight(0xff0000, 100);
    pointLightRed.position.x = 50;
    pointLightRed.position.y = 50;
    pointLightRed.position.z = 5;
    scene.add(pointLightRed);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 25);
    scene.add(directionalLight);

    var ambientLight = new THREE.AmbientLight(0x999999);
    scene.add(ambientLight);



;


    document.getElementById("renderCanvas").appendChild(renderer.domElement);
    var time = 0;

    renderScene();

    function renderScene() {
        updateCamera();
        //stats.update();
        //particle.rotation.y -= 0.0010;
        //particle.rotation.x += 0.0005;
        const rotationSpeed = 0.005;
        //particle.rotation.y += mouse.x * rotationSpeed;
        //particle.rotation.x += mouse.y * rotationSpeed;
        particle.rotation.y += (targetRotation.x * Math.PI - particle.rotation.y) * 0.005;
        particle.rotation.x += (targetRotation.y * Math.PI / 4 - particle.rotation.x) * 0.005;
  
        particle.children.forEach(child => {
            if (child.rotationSpeed) {
                child.rotation.x += child.rotationSpeed.x;
                child.rotation.y += child.rotationSpeed.y;
                child.rotation.z += child.rotationSpeed.z;
            }
        });

        currentScale += (targetScale - currentScale) * 0.1;
        particle.scale.set(currentScale, currentScale, currentScale);
    
        time += 0.05;
    
        pointLightPink.position.x = 30 + Math.sin(time) * 150;
        pointLightGreen.position.x = 20 + Math.sin(time) * 150;
        pointLightRed.position.x = 50 + Math.sin(time) * 150;
    
        pointLightPink.position.y = 20 + Math.sin(time) * 100;
        pointLightGreen.position.y = 10 + Math.sin(time) * 100;
        pointLightRed.position.y = 50 + Math.sin(time) * 100;
    
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    function updateCamera() {
        camera.updateProjectionMatrix();
    }

    function onResize(event) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize, false);

    function onMouseMove(event) {
        mouse.x = (event.clientX - windowHalf.x);
        mouse.y = (event.clientY - windowHalf.x);
    }

    function addWireframeWithLines(scene) {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff, 
            linewidth: 1,    
        });
    
        scene.traverse((object) => {
            if (object.isMesh) {
         
                const edges = new THREE.EdgesGeometry(object.geometry);
 
                const wireframe = new THREE.LineSegments(edges, lineMaterial);

                wireframe.position.copy(object.position);
                wireframe.rotation.copy(object.rotation);
                wireframe.scale.copy(object.scale);

                scene.add(wireframe);
            }
        });
    }

    function add3DCoordinateSystem(scene, size = 500, divisions = 100) {
        
    
        const gridXZ = new THREE.GridHelper(size * 2, divisions, 0xffffff, 0xffffff); // Green for grid lines
        gridXZ.rotation.x = Math.PI / 4; // Rotate to align with XZ plane
        scene.add(gridXZ);
    
        const gridXY = new THREE.GridHelper(size * 2, divisions, 0xffffff, 0xffffff); // Blue for grid lines
        gridXY.rotation.z = Math.PI / 2; // Rotate to align with XY plane
        //scene.add(gridXY);
    
        const gridYZ = new THREE.GridHelper(size * 2, divisions, 0xffffff, 0xffffff); // Red for grid lines
        gridYZ.rotation.y = Math.PI / 2; // Rotate to align with YZ plane
        //scene.add(gridYZ);
    }

    

    window.addEventListener('message', (event) => {
        if (event.data.type === 'mousemove') {
            const { x, y } = event.data;
            targetRotation.x = (x - 0.5) * 2;
            targetRotation.y = (y - 0.5) * 2;
        }
    
        if (event.data.type === 'scroll') {
            //
        }
    });

   

window.addEventListener('message', (event) => {
    if (event.data.type === 'click') {
        targetScale = targetScale === 1 ? -0.5 : 1 ;
    }

    if (event.data.type === 'mousemove') {
        const { x, y } = event.data;
        targetRotation.x = (x - 0.5) * 2;
        targetRotation.y = (y - 0.5) * 2;
    }
});
    


    
    
    window.addEventListener("mousemove", onMouseMove);

  

    /*window.addEventListener("message", (event) => {
        console.log("Received message in iframe:", event.data); // Debugging
        const { action, payload } = event.data || {};
    
        if (action === "zoomOut") {
            camera.position.z += payload.amount || 50; // Example: Zoom out
            console.log("Zooming out by:", payload.amount || 50); // Debugging
        } else if (action === "moveCamera") {
            camera.position.set(
                payload.x || camera.position.x,
                payload.y || camera.position.y,
                payload.z || camera.position.z
            );
            console.log("Moving camera to:", payload); // Debugging
        }
    });*/
    
    

}