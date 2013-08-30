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
		font-family: Monaco, "Liberation Mono", Courier, monospace;
	}
	.ce-dis{
		z-index: 999;
		pointer-events:none;
		position: absolute;
		top:0px;
		left: 0px;
		text-shadow:0 0 5px #fff;
	}
	.ce-ipt{
		outline: none;
		resize:none;
		background-color: transparent; 
		color: #999;
		overflow: hidden;
		color: #ccc;
		padding-left: 50px;
	}
</template>