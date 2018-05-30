var vertint;
var texint;

var v1;
var v2;
var u1;
var u2;
var u3;

var time = 0.0;
var resolution = [];
var mouse = [];

function GLInit(canvas){
    var gl = canvas.getContext("experimental-webgl");
    
    // シェーダ
    var vshaderScript = document.getElementById("vshader");
    var fshaderScript = document.getElementById("fshader");

    var vshader = gl.createShader(gl.VERTEX_SHADER);
    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vshader || !fshader) {
        alert("Failed to createShader().");
        return null;
    }
    gl.shaderSource(vshader, vshaderScript.text);
    gl.shaderSource(fshader, fshaderScript.text);
    gl.compileShader(vshader);
    gl.compileShader(fshader);
    gl.program = gl.createProgram();
    gl.attachShader(gl.program, vshader);
    gl.attachShader(gl.program, fshader);
    gl.linkProgram(gl.program);
    gl.useProgram(gl.program);
    
    // シェーダ変数
    v1 = gl.getAttribLocation(gl.program, "vPosition");
    v2 = gl.getAttribLocation(gl.program, "vTexCoord");
    u1 = gl.getUniformLocation(gl.program, "time");
    u2 = gl.getUniformLocation(gl.program, "resolution");
    u3 = gl.getUniformLocation(gl.program, "mouse");
    gl.enableVertexAttribArray(0);  // vPosition
    gl.enableVertexAttribArray(1);  // vTexCoord
    
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1000);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // 頂点 平面
    var vertices = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0];
    
    // UV
    var texcoords = [1, 0, 0, 0, 1, 1, 0, 1];
    
    vertint = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertint);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertint.itemSize = 3;
    vertint.numItems = 4;
    
    texint = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texint);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
    texint.itemSize = 2;
    texint.numItems = 4;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return gl;
}

function Render(gl){
    time += 1.0;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // 頂点
    gl.bindBuffer(gl.ARRAY_BUFFER, vertint);
    gl.vertexAttribPointer(v1, vertint.itemSize, gl.FLOAT, false, 0, 0);
    
    // UV
    gl.bindBuffer(gl.ARRAY_BUFFER, texint);
    gl.vertexAttribPointer(v2, texint.itemSize, gl.FLOAT, false, 0, 0);
    
    // uniform
    gl.uniform1f(u1, time*0.04);
    gl.uniform2f(u2, resolution[0], resolution[1]);
    gl.uniform2f(u3, mouse[0], mouse[1]);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertint.numItems);
    gl.flush();
}

function MouseMoveFunc(e){
    mouse[0] = e.clientX / resolution[0];
    mouse[1] = 1.0-(e.clientY / resolution[1]);
}

function Start(){
    var canvas = document.getElementById("cv");
    canvas.width = 640/2;
    canvas.height = 480/2;
    resolution = [parseFloat(canvas.width), parseFloat(canvas.height)];
    document.addEventListener("mousemove" , MouseMoveFunc);
    var gl = GLInit(canvas);
    setInterval(function() { Render(gl) }, 16);
}

window.onload = Start;
