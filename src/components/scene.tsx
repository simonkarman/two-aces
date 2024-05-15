"use client";

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Grid, CameraControls, Plane, Sphere } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Box3, TextureLoader, Vector3 } from 'three';
import { FBXLoader } from 'three-stdlib';

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
  const targetRef = useRef<Sphere | null>(null);

  useFrame(() => {
    ccRef.current?.setBoundary(new Box3(
      new Vector3( -2.5, 0,-2.5 ),
      new Vector3( 2.5, 0, 2.5 )
    ));
    ccRef.current?.getTarget(targetRef.current?.position);
  });

  return (
    <>
      <CameraControls
        ref={ccRef}
        verticalDragToForward={true}
        mouseButtons={{ left: 2, middle: 0, right: 1, wheel: 8 }}
        minDistance={1}
        maxDistance={7}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2 - Math.PI / 8}
        dollySpeed={0.25}
        truckSpeed={2}
      />
      <ambientLight/>
      <Sphere ref={targetRef} position={[0, 0, 0]} args={[0.025, 32, 32]} />
      <Void/>
      <Suspense>
        <TableTop/>
      </Suspense>
      <Suspense>
        <Card/>
      </Suspense>
    </>
  )
}

function Card() {
  const model = useLoader(FBXLoader, '/cards/playingCards.fbx');
  const texture = useLoader(TextureLoader, '/cards/playingCards_Geo_playingCards_Mat_baseColo.png');
  const normal = useLoader(TextureLoader, '/cards/playingCards_Geo_playingCards_Mat_Normal.1.png');
  const card = model.getObjectByName("diamonds")?.getObjectByName("diamonds01");
  if (card) {
    card.castShadow = true;
    card.receiveShadow = true;
  }
  useFrame(() => {
    if (card) {
      card.rotation.y += 0.01;
    }
  });
  return (<group position={card?.position.multiplyScalar(-0.01)} scale={[0.1, 0.1, 0.1]}>
    <primitive object={card}>
      <meshStandardMaterial
        map={texture}
        normalMap={normal}
      />
    </primitive>
  </group>);
}

function Void() {
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
  return <Grid position={[0, -0.02, 0]} args={[10.5, 10.5]} {...gridConfig} />;
}

function TableTop() {
  // const texture = useLoader(TextureLoader, '/paper/Paper006_2K-PNG_Color.png');
  // const normal = useLoader(TextureLoader, '/paper/Paper006_2K-PNG_NormalDX.png');
  // const roughness = useLoader(TextureLoader, '/paper/Paper006_2K-PNG_Roughness.png');
  const texture = useLoader(TextureLoader, '/fabric/Fabric039_2K-PNG_Color.png');
  const normal = useLoader(TextureLoader, '/fabric/Fabric039_2K-PNG_NormalDX.png');
  const roughness = useLoader(TextureLoader, '/fabric/Fabric039_2K-PNG_Roughness.png');

  return (<>
    <Plane
      args={[5, 5]}
      position={[0, -0.01, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial
        map={texture}
        normalMap={normal}
        roughnessMap={roughness}
      />
    </Plane>
  </>);
}
