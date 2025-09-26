document.addEventListener('DOMContentLoaded', () => {

    // --- FORM & UI ELEMENTS ---
    const formInputs = document.querySelectorAll('.form-input');
    const progressBar = document.getElementById('progressBar');
    const totalInputs = formInputs.length > 0 ? formInputs.length : 1; // Avoid division by zero
    let filledInputs = 0;

    // --- 3D SCENE SETUP ---
    const canvasContainer = document.getElementById('avatar-canvas-container');
    const loaderElement = document.getElementById('loader');
    let scene, camera, renderer, model, controls;

    // --- CONTROL BUTTONS ---
    const rotateLeftBtn = document.getElementById('rotate-left-btn');
    const rotateRightBtn = document.getElementById('rotate-right-btn');
    const saveAvatarBtn = document.getElementById('save-avatar-btn');

    // --- INITIALIZE EVERYTHING ---
    init3DScene();
    load3DModel();
    initFormListeners();

    /**
     * Sets up the basic Three.js scene, camera, lighting, and renderer.
     */
    function init3DScene() {
        if (!canvasContainer) return;

        // 1. Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf9f9f9);

        // 2. Camera
        camera = new THREE.PerspectiveCamera(50, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.6, 3.5);

        // 3. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // 4. Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        canvasContainer.appendChild(renderer.domElement);
        
        // 5. Orbit Controls for mouse rotation
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 1, 0); // Focus the camera on the avatar's center
    }

    /**
     * Loads a 3D model in glTF format.
     */
    function load3DModel() {
        if (!loaderElement) return;

        const loader = new THREE.GLTFLoader();
        loader.load(
            // ** IMPORTANT **: Is path ko apne 3D model ke sahi path se replace karein.
            // Aap Mixamo.com se free models download kar sakte hain.
            'assets/3dmodels/avatar.gltf', 
            (gltf) => {
                model = gltf.scene;
                scene.add(model);
                loaderElement.style.display = 'none'; // Hide loader on success
                animate();
            },
            undefined, 
            (error) => {
                console.error('3D model load hone mein error:', error);
                loaderElement.innerHTML = 'Failed to load model'; // Show error
            }
        );
    }
    
    /**
     * Animation loop to render the scene continuously.
     */
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    /**
     * Initializes all event listeners for the form and controls.
     */
    function initFormListeners() {
        // Update progress bar as user fills the form
        formInputs.forEach(input => {
            input.addEventListener('input', updateProgressBar);
        });

        // Handle color swatch selection
        document.querySelectorAll('.swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                const parent = e.target.parentElement;
                parent.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        // Handle form submission
        const avatarForm = document.getElementById('avatar-form');
        if(avatarForm) avatarForm.addEventListener('submit', generateAvatar);

        // Handle rotation and save buttons
        if(rotateLeftBtn) rotateLeftBtn.addEventListener('click', () => rotateModel(-0.5));
        if(rotateRightBtn) rotateRightBtn.addEventListener('click', () => rotateModel(0.5));
        if(saveAvatarBtn) saveAvatarBtn.addEventListener('click', saveAvatar);
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
    }

    function updateProgressBar() {
        filledInputs = 0;
        formInputs.forEach(input => {
            if (input.value && input.value.trim() !== '') {
                filledInputs++;
            }
        });
        const progress = (filledInputs / totalInputs) * 100;
        if(progressBar) progressBar.style.width = `${progress}%`;
    }

    function rotateModel(angle) {
        if (model) {
            model.rotation.y += angle;
        }
    }

    function generateAvatar(event) {
        event.preventDefault();
        const skinTone = document.querySelector('.skin-swatches .selected')?.dataset.color;
        
        const avatarData = {
            gender: document.getElementById('gender').value,
            age: document.getElementById('age').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            chest: document.getElementById('chest').value,
            waist: document.getElementById('waist').value,
            skinTone: skinTone,
            hairstyle: document.getElementById('hairstyle').value,
            hairColor: document.querySelector('.hair-swatches .selected')?.dataset.color,
        };

        console.log("--- AVATAR DATA COLLECTED ---", avatarData);
        alert("Avatar generated! Check console for data. Real application would now update the 3D model.");
    }
    
    function saveAvatar() {
        if (!model) {
            alert("Please generate an avatar first.");
            return;
        }
        // Yahan aap avatar ki configuration ko save karne ka logic likh sakte hain
        console.log("Avatar Saved!");
        alert("Your avatar configuration has been saved!");
    }

    function onWindowResize() {
        if (!renderer || !camera || !canvasContainer) return;
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }
});