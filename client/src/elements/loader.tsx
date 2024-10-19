"use client";

import { motion } from "framer-motion";

export default function Loader({
    size = 200,
    color = "text-primary",
}: {
    size?: number;
    color?: string;
}) {
    const nodeCount = 5;
    const nodeSize = size / 10;

    const getNodePosition = (index: number) => {
        const angle = (index / nodeCount) * Math.PI * 2;
        const radius = size / 3;
        return {
            x: Math.cos(angle) * radius + size / 2,
            y: Math.sin(angle) * radius + size / 2,
        };
    };

    return (
        <div className="flex items-center justify-center" role="status">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {[...Array(nodeCount)].map((_, i) => {
                    const start = getNodePosition(i);
                    const end = getNodePosition((i + 1) % nodeCount);
                    return (
                        <motion.line
                            key={`line-${i}`}
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                            stroke={`currentColor`}
                            className={color}
                            strokeWidth={2}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: [0, 1, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.4,
                            }}
                        />
                    );
                })}
                {[...Array(nodeCount)].map((_, i) => {
                    const { x, y } = getNodePosition(i);
                    return (
                        <motion.circle
                            key={`node-${i}`}
                            cx={x}
                            cy={y}
                            r={nodeSize}
                            className={`${color} fill-current`}
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    );
                })}
            </svg>
            <span className="sr-only">Loading blockchain network nodes...</span>
        </div>
    );
}
