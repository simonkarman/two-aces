"use client";

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Grid, CameraControls, Plane } from '@react-three/drei';
import { useRef } from 'react';
import { Box3, TextureLoader, Vector3 } from 'three';

export default function App() {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0">
      <Canvas shadows camera={{
        position: [0, 6, 3],
        fov: 60,
      }}>
        <Scene />
      </Canvas>
    </div>
  )
}

function Scene() {
  const ccRef = useRef<CameraControls | null>(null);

  useFrame(() => {
    ccRef.current?.setBoundary(new Box3(
      new Vector3( -2.5, 0,-2.5 ),
      new Vector3( 2.5, 0, 2.5 )
    ));
  });

  return (
    <>
      <ambientLight />
      <CameraControls
        ref={ccRef}
        verticalDragToForward={true}
        mouseButtons={{ left: 2, middle: 0, right: 1, wheel: 8 }}
        minDistance={1}
        maxDistance={7}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 3}
        dollySpeed={0.25}
        truckSpeed={2}
      />
      <TableTop />
    </>
  )
}

function TableTop() {
  const texture = useLoader(TextureLoader, '/paper/Paper006_2K-PNG_Color.png');
  const normal = useLoader(TextureLoader, '/paper/Paper006_2K-PNG_NormalDX.png');
  const displacement = useLoader(TextureLoader, '/paper/Paper006_2K-PNG_Displacement.png');
  const roughness = useLoader(TextureLoader, '/paper/Paper006_2K-PNG_Roughness.png');
  // const texture = useLoader(TextureLoader, '/fabric/Fabric039_2K-PNG_Color.png');
  // const normal = useLoader(TextureLoader, '/fabric/Fabric039_2K-PNG_NormalDX.png');
  // const displacement = useLoader(TextureLoader, '/fabric/Fabric039_2K-PNG_Displacement.png');
  // const roughness = useLoader(TextureLoader, '/fabric/Fabric039_2K-PNG_Roughness.png');

  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 1,
    cellColor: '#6f6f6f',
    sectionSize: 3,
    sectionThickness: 2,
    sectionColor: '#9d4b4b',
    fadeDistance: 8,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: false
  }
  return (<>
    <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
    <Plane
      args={[5, 5]}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial
        map={texture}
        normalMap={normal}
        displacementMap={displacement}
        roughnessMap={roughness}
      />
    </Plane>
  </>);
}
