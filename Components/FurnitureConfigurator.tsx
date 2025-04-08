"use client";
import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion"; // Correct import for Framer Motion
import { FaWodu, FaRegCircle, FaCube } from "react-icons/fa"; // Correct import for React Icons

type MaterialType = "wood" | "metal" | "plastic";
type ColorType = "brown" | "black" | "white";

interface PriceConfig {
  base: number;
  materials: Record<MaterialType, number>;
  colors: Record<ColorType, number>;
}

const PRICE_CONFIG: PriceConfig = {
  base: 100,
  materials: {
    wood: 0,
    metal: 50,
    plastic: -30,
  },
  colors: {
    brown: 0,
    black: 20,
    white: 15,
  },
};

const FurnitureConfigurator = () => {
  const [material, setMaterial] = useState<MaterialType>("wood");
  const [color, setColor] = useState<ColorType>("brown");
  const [size, setSize] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  // Calculate price properly without accumulation errors
  const price = useMemo(() => {
    return Math.round(
      PRICE_CONFIG.base * size +
        PRICE_CONFIG.materials[material] +
        PRICE_CONFIG.colors[color]
    );
  }, [material, color, size]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Furniture Configurator</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 3D Viewer */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-[500px]">
            <Canvas camera={{ position: [3, 2, 5], fov: 50 }} gl={{ antialias: true }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <Environment preset="city" />

              <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]} scale={[size, size, size]}>
                <boxGeometry args={[1, 1.5, 1]} />
                <meshStandardMaterial
                  color={
                    color === "brown"
                      ? "#59332e"
                      : color === "black"
                      ? "#222222"
                      : "#ffffff"
                  }
                  metalness={material === "metal" ? 0.8 : 0.1}
                  roughness={material === "wood" ? 0.7 : 0.4}
                />
              </mesh>

              <OrbitControls
                target={[0, 0.5, 0]}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
                enableZoom={true}
                enablePan={true}
              />
            </Canvas>
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Material</label>
              <div className="flex gap-4">
                {Object.entries(PRICE_CONFIG.materials).map(([mat, cost]) => (
                  <motion.button
                    key={mat}
                    onClick={() => setMaterial(mat as MaterialType)}
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      material === mat
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {mat === "wood" && <FaWodu size={30} />}
                    {mat === "metal" && <FaRegCircle size={30} />}
                    {mat === "plastic" && <FaCube size={30} />}
                    <div className="mt-1 text-xs">{`${cost >= 0 ? "+" : ""}$${cost}`}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <div className="flex gap-4">
                {Object.entries(PRICE_CONFIG.colors).map(([col, cost]) => (
                  <motion.button
                    key={col}
                    onClick={() => setColor(col as ColorType)}
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      color === col
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full`}
                      style={{
                        backgroundColor:
                          col === "brown" ? "#59332e" : col === "black" ? "#222222" : "#ffffff",
                      }}
                    />
                    <div className="mt-1 text-xs">{`${cost >= 0 ? "+" : ""}$${cost}`}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Size: {size.toFixed(1)}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={size}
                onChange={(e) => setSize(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="p-6 bg-gray-100 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800">${price}</h2>
              <p className="text-sm text-gray-600 mt-1">Base: ${PRICE_CONFIG.base}</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm">Material: +${PRICE_CONFIG.materials[material]}</p>
                <p className="text-sm">Color: +${PRICE_CONFIG.colors[color]}</p>
                <p className="text-sm">Size: ×{size.toFixed(1)}</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${isCopied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {isCopied ? '✓ Copied!' : 'Share Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureConfigurator;

