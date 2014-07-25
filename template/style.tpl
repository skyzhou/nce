<template name="NCE.STYLE.EDITOR">
	.ce-wrap{
		border: 1px solid #ccc;
		position: relative;
	}
	.ce-dis,.ce-ipt{
		line-height: 18px;
		white-space: pre;
		height: 80px;
		font-size: 12px;
		padding: 0px;
		margin: 0px;
		word-wrap:break-word;
		border: 0px;
	}
	.ce-dis{
		z-index: 222;
		pointer-events:none;
		position: absolute;
		top:0px;
		left: 0px;
		text-shadow:0 0 5px #fff;
		font-family: Consolas, "Liberation Mono", Courier, monospace;
	}
	.ce-ipt{
		outline: none; 
		resize:none;
		background-color: transparent; 
		overflow: hidden;
		color: #000;
		margin-left: 40px;
		border-left:1px solid #ccc;
		padding-left:10px;
		vertical-align:bottom;
		font-family: Nce,Consolas, "Liberation Mono", Courier, monospace;
	}
</template>