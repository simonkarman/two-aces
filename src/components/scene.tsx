"use client";

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Grid, CameraControls, Plane, Sphere, ShapeProps } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState } from 'react';
import { Box3, TextureLoader, Vector3, SphereGeometry, Mesh, Quaternion, Euler } from 'three';
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
  const targetRef = useRef<ShapeProps<typeof SphereGeometry> | null>(null);

  useFrame(() => {
    ccRef.current?.setBoundary(new Box3(
      new Vector3( -2.5, 0,-2.5 ),
      new Vector3( 2.5, 0, 2.5 )
    ));
    ccRef.current?.getTarget(targetRef.current?.position as Vector3);
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
      <Sphere ref={targetRef as any} position={[0, 0, 2]} args={[0.025, 32, 32]} />
      <Void/>
      <TableTop/>
      {[0, 1, 2, 3].map(i => {
        const hand = new Quaternion().setFromAxisAngle( new Vector3( 0, 1, 0 ), Math.PI / 2 * i );
        const cards = new Quaternion().setFromAxisAngle( new Vector3( 1, 0, 0 ), Math.PI / 2 * 0.6 );
        const isSelf = i === 0;
        return (
          <group key={i} quaternion={hand}>
            <group position={new Vector3(0, 0.35, 1.3)} quaternion={cards}>
              <Card
                isClickable={isSelf}
                suit={'clubs'}
                value={'01'}
                position={new Vector3(-0.25, -0.01, 0)}
                rotation={[0, Math.PI / 9, 0]}
              />
              <Card
                isClickable={isSelf}
                suit={'hearts'}
                value={'12'}
                position={new Vector3(0, 0, -0.05)}
              />
              <Card
                isClickable={isSelf}
                suit={'hearts'}
                value={'07'}
                position={new Vector3(0.25, 0.01, 0)}
                rotation={[0, -Math.PI / 9, 0]}
              />
            </group>
          </group>
        );
      })}
      <Card suit={'diamonds'} value={'04'} position={new Vector3(-0.25, 0, 0)} scale={1.2}/>
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
        return (
          <Card key={i} suit={'diamonds'} value={'04'} position={new Vector3(0.25, i * 0.02, 0)} rotation={[0, 0, Math.PI]} scale={1.2}/>
        )
      })}
    </>
  )
}

function Card(props: {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades',
  value: '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13',
  position: Vector3,
  rotation?: Euler | Parameters<Euler['set']>,
  scale?: number,
  isClickable?: boolean,
}) {
  // Load all required assets
  const _model = useLoader(FBXLoader, '/cards/playingCards.fbx');
  const texture = useLoader(TextureLoader, '/cards/playingCards_Geo_playingCards_Mat_baseColo.png');
  const normal = useLoader(TextureLoader, '/cards/playingCards_Geo_playingCards_Mat_Normal.1.png');

  // Process the model to find the correct card
  const card = useMemo(() => {
    // Clone the model to avoid modifying the original
    const model = _model.clone();

    // Find the correct card in the deck by suit and value
    const card = model.getObjectByName(props.suit)?.getObjectByName(`${props.suit}${props.value}`)! as Mesh;

    // Reset the card's position to the center of the scene
    card.geometry.computeBoundingBox();
    const center = card.geometry.boundingBox!.getCenter(new Vector3());
    card.translateX(-card.position.x -center.x);
    card.translateY(-card.position.y - center.y);
    card.translateZ(-card.position.z - center.z);

    // Return the card
    card.castShadow = true;
    card.receiveShadow = true;
    return card;
  }, [_model, props.suit, props.value]);

  const scale = props.scale ?? 1;

  // Render the card
  return (<group
    position={props.position}
    scale={[0.05 * scale, 0.05 * scale, 0.05 * scale]}
    rotation={props.rotation}
    onClick={() => {
      if (props.isClickable) {
        console.log(`Clicked ${props.suit} ${props.value} in hand`);
        return;
      }
    }}
  >
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
    sectionColor: '#104352',
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

  const [position] = useState(new Vector3(0, -0.01, 0));
  return (<>
    <Plane
      args={[5, 5]}
      position={position}
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
