scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = 15

light1 = new THREE.DirectionalLight(0xffffff, 1.5)
light1.position.set(1, 1, 1).normalize()
light2 = new THREE.DirectionalLight(0xffffff, 5)
light2.position.set(-6, 1, -5).normalize()
scene.add(light1, light2)

gray = new THREE.MeshLambertMaterial({color : 'rgb(100, 100, 100)'})
z = null
loader = new THREE.OBJLoader()
loader.load( "z.obj", function (obj) {
        obj.traverse( function ( child ) { if ( child instanceof THREE.Mesh ) { child.material = gray } } )
        z = obj
        scene.add(obj)
    }
)

function render () {
    requestAnimationFrame(render)
    z.rotation.y += 0.01
    renderer.render(scene, camera)
}

render()
