import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit2, 
  Highlighter, 
  Eraser, 
  Trash2, 
  Download, 
  Grid, 
  Sparkles, 
  Users
} from 'lucide-react';
import { getSocket } from '../utils/socketManager';

export default function Whiteboard({ classId, user }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Whiteboard States
  const [tool, setTool] = useState('pen'); // 'pen', 'highlighter', 'eraser'
  const [color, setColor] = useState('#0d9488'); // Default teal
  const [thickness, setThickness] = useState(5); // Default medium thickness
  const [hasGrid, setHasGrid] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [onlineDrawers, setOnlineDrawers] = useState([]);
  
  const lastPointRef = useRef({ x: 0, y: 0 });
  const strokesRef = useRef([]); // Local copy of all strokes (normalized)

  // Color Palette Options
  const colors = [
    '#0d9488', // Teal
    '#0f172a', // Dark slate
    '#dc2626', // Red
    '#2563eb', // Blue
    '#16a34a', // Green
    '#d97706', // Amber
    '#7c3aed', // Violet
    '#db2777', // Pink
  ];

  // Helper: Draw a single stroke segment on the canvas
  const drawSegment = useCallback((ctx, x0, y0, x1, y1, strokeColor, strokeThickness, strokeTool, canvasWidth, canvasHeight) => {
    ctx.beginPath();
    ctx.moveTo(x0 * canvasWidth, y0 * canvasHeight);
    ctx.lineTo(x1 * canvasWidth, y1 * canvasHeight);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (strokeTool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = strokeThickness * (canvasWidth / 1000) * 2; // Eraser is double thickness
      ctx.globalAlpha = 1.0;
    } else {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeThickness * (canvasWidth / 1000);
      ctx.globalAlpha = strokeTool === 'highlighter' ? 0.4 : 1.0;
    }
    
    ctx.stroke();
    ctx.globalAlpha = 1.0; // Reset alpha
  }, []);

  // Redraw all strokes from memory
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid if enabled
    if (hasGrid) {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Redraw strokes
    strokesRef.current.forEach((stroke) => {
      drawSegment(
        ctx,
        stroke.x0,
        stroke.y0,
        stroke.x1,
        stroke.y1,
        stroke.color,
        stroke.thickness,
        stroke.tool,
        canvas.width,
        canvas.height
      );
    });
  }, [hasGrid, drawSegment]);

  // Adjust canvas size to fit container dynamically
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Update dimensions maintaining aspect ratio (e.g. height is 60% of width, minimum 500px)
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.max(rect.width * 0.5625, 450); // 16:9 ratio, min 450px

      redrawCanvas();
    };

    window.addEventListener('resize', handleResize);
    // Timeout to make sure DOM is fully ready
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [redrawCanvas]);

  // Socket logic
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Fetch initial whiteboard history
    socket.emit('get-whiteboard-history', classId, (history) => {
      strokesRef.current = history;
      redrawCanvas();
    });

    // Listen for peer strokes
    const handleDrawStroke = (stroke) => {
      strokesRef.current.push(stroke);
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawSegment(
            ctx,
            stroke.x0,
            stroke.y0,
            stroke.x1,
            stroke.y1,
            stroke.color,
            stroke.thickness,
            stroke.tool,
            canvas.width,
            canvas.height
          );
        }
      }
    };

    // Listen for clear board
    const handleClearCanvas = () => {
      strokesRef.current = [];
      redrawCanvas();
    };

    socket.on('draw-stroke', handleDrawStroke);
    socket.on('clear-canvas', handleClearCanvas);

    return () => {
      socket.off('draw-stroke', handleDrawStroke);
      socket.off('clear-canvas', handleClearCanvas);
    };
  }, [classId, redrawCanvas, drawSegment]);

  // Handle Drawing Start
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    if (clientX === undefined || clientY === undefined) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    lastPointRef.current = { x, y };
    setIsDrawing(true);
  };

  // Handle Drawing Progress
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    if (clientX === undefined || clientY === undefined) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Normalize coordinates (0 to 1)
    const normalizedX0 = lastPointRef.current.x / canvas.width;
    const normalizedY0 = lastPointRef.current.y / canvas.height;
    const normalizedX1 = x / canvas.width;
    const normalizedY1 = y / canvas.height;

    const stroke = {
      x0: normalizedX0,
      y0: normalizedY0,
      x1: normalizedX1,
      y1: normalizedY1,
      color,
      thickness,
      tool
    };

    // Store stroke and draw locally
    strokesRef.current.push(stroke);
    drawSegment(
      ctx,
      normalizedX0,
      normalizedY0,
      normalizedX1,
      normalizedY1,
      color,
      thickness,
      tool,
      canvas.width,
      canvas.height
    );

    // Sync via socket
    const socket = getSocket();
    if (socket) {
      socket.emit('draw-stroke', { classId, stroke });
    }

    lastPointRef.current = { x, y };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear Canvas (Collaborative)
  const handleClear = () => {
    strokesRef.current = [];
    redrawCanvas();

    const socket = getSocket();
    if (socket) {
      socket.emit('clear-canvas', { classId });
    }
  };

  // Download whiteboard as image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // To prevent transparent background in downloaded image, draw onto a temporary white canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Fill white background
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw grid if active
    if (hasGrid) {
      tempCtx.strokeStyle = '#f1f5f9';
      tempCtx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < tempCanvas.width; x += gridSize) {
        tempCtx.beginPath();
        tempCtx.moveTo(x, 0);
        tempCtx.lineTo(x, tempCanvas.height);
        tempCtx.stroke();
      }
      for (let y = 0; y < tempCanvas.height; y += gridSize) {
        tempCtx.beginPath();
        tempCtx.moveTo(0, y);
        tempCtx.lineTo(tempCanvas.width, y);
        tempCtx.stroke();
      }
    }

    // Draw all strokes
    strokesRef.current.forEach((stroke) => {
      drawSegment(
        tempCtx,
        stroke.x0,
        stroke.y0,
        stroke.x1,
        stroke.y1,
        stroke.color,
        stroke.thickness,
        stroke.tool,
        tempCanvas.width,
        tempCanvas.height
      );
    });

    const dataUrl = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `whiteboard-${classId}-${new Date().toISOString().slice(0,10)}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden h-full">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100/80 shadow-sm">
        
        {/* Tool Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-3 rounded-xl transition-all ${
              tool === 'pen' ? 'bg-teal-600 text-white shadow-md shadow-teal-100' : 'text-slate-400 hover:bg-slate-50'
            }`}
            title="Pen"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('highlighter')}
            className={`p-3 rounded-xl transition-all ${
              tool === 'highlighter' ? 'bg-teal-600 text-white shadow-md shadow-teal-100' : 'text-slate-400 hover:bg-slate-50'
            }`}
            title="Highlighter"
          >
            <Highlighter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-3 rounded-xl transition-all ${
              tool === 'eraser' ? 'bg-teal-600 text-white shadow-md shadow-teal-100' : 'text-slate-400 hover:bg-slate-50'
            }`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>
        </div>

        {/* Thickness Selector */}
        {tool !== 'eraser' && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Size</span>
            <input
              type="range"
              min="2"
              max="30"
              value={thickness}
              onChange={(e) => setThickness(parseInt(e.target.value))}
              className="w-24 accent-teal-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-600 w-6">{thickness}px</span>
          </div>
        )}

        {/* Color Palette */}
        {tool !== 'eraser' && (
          <div className="flex items-center gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  color === c ? 'border-teal-600 scale-125 shadow-sm' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setHasGrid(!hasGrid)}
            className={`p-3 rounded-xl border transition-all ${
              hasGrid ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
            }`}
            title="Toggle Grid Lines"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={downloadImage}
            className="p-3 bg-white border border-slate-100 hover:bg-slate-50 text-slate-500 rounded-xl transition-all"
            title="Download Notes"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleClear}
            className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider"
            title="Clear Board"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Board Canvas Area */}
      <div 
        ref={containerRef}
        className="w-full flex-1 min-h-[450px] relative bg-white rounded-3xl border border-slate-100 shadow-inner overflow-hidden cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 block"
        />

        {/* Live indicator in corner */}
        <div className="absolute top-4 left-4 bg-teal-600/90 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-teal-100 backdrop-blur-sm pointer-events-none select-none animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Live Collaborative Board
        </div>
      </div>
    </div>
  );
}
