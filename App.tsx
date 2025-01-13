import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices, useCodeScanner, getCameraDevice } from 'react-native-vision-camera';

const App: React.FC = (props) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const devices = useCameraDevices();
  const device = getCameraDevice(devices, 'back');

  useEffect(() => {
    const getPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      console.log(cameraPermission)
      setHasPermission(cameraPermission === 'granted');
    };

    getPermissions();
  }, []);

  const codeScanner: CodeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      for (const code of codes) {
        setIsScanning(false)
        console.log(`Code Value: ${code.value}`);
         Alert.alert('Scanned Code', `${code.value}`, [
           {
             text: 'OK',
             onPress: () => setIsScanning(true), // Stop scanning after alert
           },
       ]);
      }
    },
  });

  if (device == null) return <Text>Loading camera...</Text>;
  if (!hasPermission) return <Text>No camera permission</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessorFps={2}
        {...props}
        codeScanner={isScanning ? codeScanner : undefined}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Point the camera at a code</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;