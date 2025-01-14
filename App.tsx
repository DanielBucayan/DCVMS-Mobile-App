import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices, useCodeScanner, getCameraDevice } from 'react-native-vision-camera';

const App: React.FC = (props) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const devices = useCameraDevices();
  const device = getCameraDevice(devices, 'back');
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');

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

if (isHomeScreen) {
    // Render the home screen
    return (
      <SafeAreaView style={styles.homeContainer}>
        <Text style={styles.homeText}>Welcome to the Dress Code Violation Issuance App</Text>

        <TextInput
        style={styles.inputName}
        placeholder="Name"
        placeholderTextColor="#000000"
        value={name}
        onChangeText={(text) => setName(text)}
        />
        <TextInput
              style={styles.inputId}
              placeholder="ID Number"
              placeholderTextColor="#000000"
              value={id}
              onChangeText={(text) => setId(text)}
              />
        <TextInput
                style={styles.inputCourse}
                placeholder="Course"
                placeholderTextColor="#000000"
                value={course}
                onChangeText={(text) => setCourse(text)}
                />

        <TextInput
                style={styles.inputDate}
                placeholder="Date"
                placeholderTextColor="#000000"
                value={date}
                onChangeText={(text) => setDate(text)}
        />

        <TextInput
                style={styles.inputTime}
                placeholder="Time"
                placeholderTextColor="#000000"
                value={time}
                onChangeText={(text) => setTime(text)}
        />
        <TextInput
                style={styles.inputReason}
                placeholder="Reason"
                placeholderTextColor="#000000"
                value={reason}
                onChangeText={(text) => setReason(text)}
        />
        <Button
          title="Start Scanning"
          onPress={() => setIsHomeScreen(false)}
          color="#B59410"
        />
        <Button
          title="Submit"
          onPress={() => setIsHomeScreen(false)}
          color="#B59410"
        />
      </SafeAreaView>
    );
  }

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
      <Button
            title="Back to Home"
            onPress={() => setIsHomeScreen(true)}
            color="#B59410"
      />
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
  homeContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'blue',
    },
    inputName: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    inputId: {
          width: '80%',
          height: 50,
          backgroundColor: '#fff',
          borderRadius: 8,
          paddingHorizontal: 15,
          marginBottom: 15,
          fontSize: 16,
          color: '#000',
      },
    inputCourse: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    inputDate: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    inputTime: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    inputReason: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    homeText: {
      color: 'white',
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
    },
});

export default App;