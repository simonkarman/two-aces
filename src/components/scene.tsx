"use client";

import { Box, PerspectiveCamera, Plane, Grid } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Ref, useEffect, useRef } from 'react';
import { Euler, TextureLoader, Vector2 } from 'three';

const CameraController = () => {
  const { camera } = useThree();
  const direction = useRef(new Vector2(0, 0));

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to range -1 to 1
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Adjust these values to control the camera
      const deadZone = 0.6;
      const sensitivity = 0.05;

      // Calculate movement for X and Y
      const magnitudeX = Math.max(0, Math.abs(mouseX) - deadZone) / (1 - deadZone) * Math.sign(mouseX);
      const magnitudeY = Math.max(0, Math.abs(mouseY) - deadZone) / (1 - deadZone) * Math.sign(mouseY);

      // Set the camera direction
      direction.current = new Vector2(magnitudeX, magnitudeY).multiplyScalar(sensitivity);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleMouseOut = () => {
      direction.current = new Vector2(0, 0);
    };
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [camera]);

  useFrame(() => {
    // Move the camera
    camera.position.x += direction.current.x;
    camera.position.y += direction.current.y;
  })

  return null;
}

function Ground() {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: '#6f6f6f',
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: '#9d4b4b',
    fadeDistance: 30,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };
  return <Grid position={[0, 0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
}

const Floor = () => {
  const texture = useLoader(TextureLoader, '/floor.jpg');

  return (<>
    <Plane args={[5, 5]} rotation={new Euler(0, 0, 0)} position={[0, 0, 0]}>
      <meshStandardMaterial attach="material" map={texture} />
    </Plane>
    <Ground />
  </>);
};

const Scene = () => {
  return (
    <div className='absolute top-0 bottom-0 left-0 right-0'>
      <Canvas>
        <CameraController />
        <PerspectiveCamera makeDefault position={[0, -3, 2]} rotation={new Euler(1, 0, 0)} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Floor />
        <Box args={[1, 1, 1]} position={[0, 0, 0.5]} rotation={new Euler(0, 0, 0)}>
          <meshStandardMaterial attach="material" color="orange" />
        </Box>
        <Box args={[1, 1, 1]} position={[-1.1, 0, 0.5]} rotation={new Euler(0, 0, 5)}>
          <meshStandardMaterial attach="material" color="orange" />
        </Box>
      </Canvas>
    </div>
  );
};

export default Scene;
