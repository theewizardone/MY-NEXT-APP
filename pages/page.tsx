"use client";
import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';


type MaterialType = 'wood' | 'metal' | 'fabric';
type ColorType = 'natural' | 'walnut' | 'white' | 'black';

const FurnitureConfigurator = () => {
  const [material, setMaterial] = useState<MaterialType>('wood');
  const [color, setColor] = useState<ColorType>('natural');
  const [size, setSize] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  // Price configuration
  const price = useMemo(() => {
    const basePrice = 249;
    const materialPrices = {
      wood: 0,
      metal: 50,
      fabric: 30
    };
    const colorPrices = {
      natural: 0,
      walnut: 20,
      white: 15,
      black: 25
    };
    return Math.round(basePrice + materialPrices[material] + colorPrices[color] * size);
  }, [material, color, size]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `Custom ${material} chair in ${color} - $${price}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Chair Configurator</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* 3D Viewer */}
          <div className="bg-white rounded-xl shadow-lg h-[500px]">
            <Canvas camera={{ position: [2, 2, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Environment preset="city" />
              
              <mesh scale={[size, size, size]} rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[1, 1.5, 1]} />
                <meshStandardMaterial
                  color={
                    color === 'natural' ? '#d2b48c' :
                    color === 'walnut' ? '#3a2a1a' :
                    color === 'white' ? '#ffffff' : '#222222'
                  }
                  metalness={material === 'metal' ? 0.8 : 0.1}
                  roughness={material === 'fabric' ? 0.7 : 0.4}
                />
              </mesh>
              
              <OrbitControls 
                enableZoom={true}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Customization</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Material</label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value as MaterialType)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="wood">Wood (+$0)</option>
                    <option value="metal">Metal (+$50)</option>
                    <option value="fabric">Fabric (+$30)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value as ColorType)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="natural">Natural (+$0)</option>
                    <option value="walnut">Walnut (+$20)</option>
                    <option value="white">White (+$15)</option>
                    <option value="black">Black (+$25)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Size: {size.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="1.5"
                    step="0.1"
                    value={size}
                    onChange={(e) => setSize(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">${price}</h2>
                <button
                  onClick={handleShare}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isCopied ? 'bg-green-500' : 'bg-blue-600'
                  } text-white`}
                >
                  {isCopied ? '✓ Copied!' : 'Share Design'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureConfigurator;