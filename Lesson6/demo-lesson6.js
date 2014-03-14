var isMouseButtonDown = false;
var lastX = 0;
var lastY = 0;
var bigModel = null;
var smallModel = null;
var modelXMax = 250.0;
var modelYMax = 250.0;
var modelZMax = 250.0;
var smallModeSize = 10.0;
var viewport = new WYVec4(0.0, 0.0, modelXMax, modelYMax);

var projMatrix = WYMat4.makeOrtho(0.0, modelXMax, 0.0, modelYMax, -1.0, 1.0);
var modelViewMatrix = WYMat4.makeIdentity();


var usePerspective = false;

function resizeCanvas(w, h)
{
	viewport.data[2] = w;
	viewport.data[3] = h;
	if(usePerspective)
		projMatrix = WYMat4.makePerspective(45.0, w / h, -1.0, 1.0);
	else
		projMatrix = WYMat4.makeOrtho(0.0, w, 0.0, h, -1.0, 1.0)
	//使用默认的视点就够了，所以不调用LookAt.
	modelViewMatrix = WYMat4.makeIdentity();
	modelViewMatrix.translateX(w / 2.0);
	modelViewMatrix.translateY(h / 2.0);
}

function mouseDown(mouseEvent)
{
	isMouseButtonDown = true;
	lastX = mouseEvent.offsetX == null ? mouseEvent.layerX : mouseEvent.offsetX;
	lastY = mouseEvent.offsetY == null ? mouseEvent.layerY : mouseEvent.offsetY;
}

function mouseUp()
{
	isMouseButtonDown = false;
}

function rotate(mouseEvent)
{
	if(!isMouseButtonDown) return;
	var x = mouseEvent.offsetX == null ? mouseEvent.layerX : mouseEvent.offsetX;
	var y = mouseEvent.offsetY == null ? mouseEvent.layerY : mouseEvent.offsetY;

	modelViewMatrix = WYMat4.mat4Mul(modelViewMatrix, WYMat4.makeXRotation((y - lastY) / 100.0));
	modelViewMatrix = WYMat4.mat4Mul(modelViewMatrix, WYMat4.makeYRotation((x - lastX) / 100.0));

	lastX = x;
	lastY = y;
}

function genBigModel(width, height, depth)
{
	bigModel = new Array(30);
	for(var i = 0; i != 30; ++i)
	{
		bigModel[i] = new WYVec4(Math.random() * width * 2 - width,
			Math.random() * height * 2 - height,
			Math.random() * depth * 2 - depth,
			1.0);
	}
}

function genSmallModel(size)
{
	smallModel = new Array(
		new WYVec4(-size, -size, size, 1.0),
		new WYVec4(size, -size, size, 1.0),
		new WYVec4(size, size, size, 1.0),
		new WYVec4(-size, size, size, 1.0),
		new WYVec4(-size, -size, -size, 1.0),
		new WYVec4(size, -size, -size, 1.0),
		new WYVec4(size, size, -size, 1.0),
		new WYVec4(-size, size, -size, 1.0));
}

genBigModel(modelXMax, modelYMax, modelZMax);
genSmallModel(smallModeSize);

function drawBigModel(ctx)
{
	var modelPoint = new Array(bigModel.length);

	for(var i = 0; i < bigModel.length; ++i)
	{
		modelPoint[i] = new WYVec3();
		WYMat4.projectM4(bigModel[i], modelViewMatrix, projMatrix, viewport, modelPoint[i]);
	}

	for(var i = 0; i < bigModel.length; ++i)
	{
		for(var j = i+1; j < bigModel.length; ++j)
		{
			ctx.moveTo(modelPoint[i].data[0], modelPoint[i].data[1]);
			ctx.lineTo(modelPoint[j].data[0], modelPoint[j].data[1]);
		}
	}
	ctx.stroke();
}

function drawSmallModel(ctx)
{
	var modelPoint = new Array(smallModel.length);

	for(var i = 0; i < smallModel.length; ++i)
	{
		modelPoint[i] = new WYVec3();
		WYMat4.projectM4(smallModel[i], modelViewMatrix, projMatrix, viewport, modelPoint[i]);
	}

	for(var i = 0; i < smallModel.length; ++i)
	{
		for(var j = i+1; j < smallModel.length; ++j)
		{
			ctx.moveTo(modelPoint[i].data[0], modelPoint[i].data[1]);
			ctx.lineTo(modelPoint[j].data[0], modelPoint[j].data[1]);
		}
	}
	ctx.stroke();
}

function drawCanvas(cvsName)
{
	var cvsObj = document.getElementById(cvsName);
	var cvsContext = cvsObj.getContext("2d");
	cvsContext.fillStyle="#000";
	cvsContext.clearRect(0, 0, cvsObj.width, cvsObj.height);

	cvsContext.lineWidth = 2;
	cvsContext.strokeStyle = "#ff0";
	cvsContext.beginPath();
	drawBigModel(cvsContext);
	drawSmallModel(cvsContext);
	cvsContext.closePath();
//	modelViewMatrix = WYMat4.mat4Mul(modelViewMatrix, WYMat4.makeZRotation(0.1));	
}