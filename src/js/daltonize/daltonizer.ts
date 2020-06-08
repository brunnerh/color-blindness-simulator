import { deficiencies, Deficiency, DeficiencyType } from "./deficiencies";
import fragmentShaderSource from "raw-loader!./shader/colorblind.frag";
import vertexShaderSource from "raw-loader!./shader/rectangle.vert";

function compileShader(gl: WebGLRenderingContext, shaderType: number, shaderSource: string)
{
	const shader = gl.createShader(shaderType);
	if (shader == null)
		throw new Error(`Counld not create shader of type ${shaderType}`);

	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		throw new Error(
			"An error occurred compiling the shaders: " +
			gl.getShaderInfoLog(shader)
		);
	}

	return shader;
}

export class Daltonizer
{
	private canvas!: HTMLCanvasElement;
	private gl!: WebGLRenderingContext;
	private program!: WebGLProgram;
	private texcoordLocation!: GLint;
	private resolutionLocation!: WebGLUniformLocation | null;
	private lineLocation!: WebGLUniformLocation | null;
	private anomLocation!: WebGLUniformLocation | null;
	private achromaLocation!: WebGLUniformLocation | null;
	private enabledLocation!: WebGLUniformLocation | null;
	private texcoordBuffer: WebGLBuffer | null = null;
	private video!: HTMLVideoElement;

	constructor(canvas: HTMLCanvasElement, video: HTMLVideoElement)
	{
		this.initCanvas(canvas);
		this.bindSource(video);
	}

	getCanvas()
	{
		return this.canvas;
	}

	initCanvas(canvas: HTMLCanvasElement)
	{
		const gl = canvas.getContext("webgl");

		if (!gl)
		{
			throw new Error("Could not initialize WebGL context!");
		}

		// setup GLSL program
		const program = gl.createProgram();

		if (!program)
		{
			throw new Error("Could not create WebGL program!");
		}

		const fragmentShader = compileShader(
			gl,
			gl.FRAGMENT_SHADER,
			fragmentShaderSource,
		);
		const vertexShader = compileShader(
			gl,
			gl.VERTEX_SHADER,
			vertexShaderSource,
		);

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		// store attribute locations
		this.texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
		this.resolutionLocation = gl.getUniformLocation(program, "u_resolution");
		this.lineLocation = gl.getUniformLocation(program, "u_blinderLine");
		this.anomLocation = gl.getUniformLocation(program, "u_anomalize");
		this.achromaLocation = gl.getUniformLocation(program, "u_achroma");
		this.enabledLocation = gl.getUniformLocation(program, "u_enabled");

		this.canvas = canvas;
		this.gl = gl;
		this.program = program;
	}

	bindSource(video: HTMLVideoElement)
	{
		const canvas = this.canvas;
		const gl = this.gl;

		// provide texture coordinates for the rectangle.
		const texcoordBuffer = (this.texcoordBuffer = gl.createBuffer());
		gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				0.0,
				0.0,
				1.0,
				0.0,
				0.0,
				1.0,
				0.0,
				1.0,
				1.0,
				0.0,
				1.0,
				1.0,
			]),
			gl.STATIC_DRAW,
		);

		// Create a texture.
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Set the parameters so we can render any size image.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		this.video = video;
	}

	render(deficiency: DeficiencyType, enabled = true)
	{
		const gl = this.gl;
		const program = this.program;
		const video = this.video;

		if (!video)
			return;

		gl.canvas.width = video.videoWidth;
		gl.canvas.height = video.videoHeight;

		// Tell WebGL how to convert from clip space to pixels
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// Upload the image into the texture.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

		// Clear the canvas
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Tell it to use our program (pair of shaders)
		gl.useProgram(program);

		// Turn on the texcord attribute
		gl.enableVertexAttribArray(this.texcoordLocation);

		// Bind the texcoord buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

		// Tell the texCoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
		gl.vertexAttribPointer(this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);

		// set the resolution
		gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);

		const data = deficiencies[deficiency];
		if (data.blinder)
		{
			gl.uniform4fv(this.lineLocation, Object.values(data.blinder));
		}
		gl.uniform1i(this.anomLocation, +data.anomalize);
		gl.uniform1i(this.achromaLocation, +data.achroma);
		gl.uniform1i(this.enabledLocation, +enabled);

		// Draw the rectangle.
		gl.drawArrays(
			gl.TRIANGLES,
			0,
			6, // 2 triangles, 3 vertices each
		);
	}
}
