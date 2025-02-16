import React, { useState, useEffect } from 'react';

import { SafeAreaView, Text, View, StyleSheet, Alert, Button, TextInput } from 'react-native';

import { Camera, useCameraDevices, useCodeScanner, getCameraDevice } from 'react-native-vision-camera';

import { Picker } from '@react-native-picker/picker';


const App: React.FC = (props) => {

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const [isScanning, setIsScanning] = useState<boolean>(true);

  const [isHomeScreen, setIsHomeScreen] = useState<boolean>(true);

  const devices = useCameraDevices();

  const device = getCameraDevice(devices, 'back');

  const [name, setName] = useState<string>('');

  const [id, setId] = useState<string>('');

  const [course, setCourse] = useState<string>('');

  const [date, setDate] = useState<string>('');

  const [time, setTime] = useState<string>('');

  const [violation, setViolation] = useState<string>('');

  const [vioDate, setVioDate] = useState<string>('');

  const [imageUri, setImageUri] = useState<string>('');

  const [violationFetched, setViolationFetched] = useState(false);

  const violationsList = ['  No ID', '  Improper Mon-Thurs Attire', '  Improper Footwear', 'Inappropriate Lower Attire'];


  useEffect(() => {

    const getPermissions = async () => {

      const cameraPermission = await Camera.requestCameraPermission();

      console.log(cameraPermission);

      setHasPermission(cameraPermission === 'granted');

    };



    getPermissions();

  }, []);



const codeScanner: CodeScanner = useCodeScanner({
  codeTypes: ['qr'],
  onCodeScanned: (codes) => {
    for (const code of codes) {
      setIsScanning(false);
      console.log(`Code Value: ${code.value}`);

      const regex = /(\d{4})-(\d{6})([A-Za-z.\s]+?)([A-Z]{2,}-[A-Z]{2,})/;
      const match = code.value.match(regex);

      if (match) {
        const scannedId = `${match[1]}-${match[2]}`;
        const scannedName = match[3];
        const scannedCourse = match[4];

        // Get current date in YYYY-MM-DD format
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format

        // Get current time in 24-hour format: HH:mm:ss
        const currentTime = now.toLocaleTimeString('en-GB', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        const vioDate = '${currentDate} ${currentTime}';
        console.log('vioDate:', vioDate);

        // Show the alert with scanned info
        Alert.alert('Scanned Code', `Scanned Code: ${code.value}`, [
          {
            text: 'OK',
            onPress: () => {
              // Set scanned data and show home screen
              setId(scannedId);
              setName(scannedName);
              setCourse(scannedCourse);
              setDate(currentDate);
              setTime(currentTime);
              setVioDate(vioDate);

              setIsHomeScreen(true);
              setIsScanning(true);
            },
          },
        ]);
      } else {
        // Show error if the QR code doesn't match the expected format
        Alert.alert('Error', 'Invalid QR Code format', [
          { text: 'OK', onPress: () => setIsScanning(true) },
        ]);
      }
    }
  },
});

  const fetchViolationData = async () => {
    try {
      const response = await fetch('https://slateblue-gerbil-865863.hostingersite.com/connections/newConnection.php', {
        method: 'GET',
      });

      const result = await response.json();

      if (response.ok) {
        if (result.image_base64 && result.violation) {
          setImageUri(result.image_base64);

          // Set violation state
          setViolation(result.violation);

          // Check if the fetched violation exists in the violation list
          if (violationsList.includes(result.violation)) {
            setViolation(result.violation);
          } else {
            // If the violation doesn't exist in the predefined list, set it to the fetched value
            setViolation(result.violation);
          }
        } else {
          Alert.alert('No records found', 'There are no violation records available.');
        }
      } else {
        Alert.alert('Error', result.error || 'Failed to fetch data');
        setViolationFetched(false); // Reset if there's an error
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong while fetching data');
      setViolationFetched(false); // Reset if error occurs
    }
  };

const handleSubmit = async () => {
    if (!name || !id || !course || !date || !time || !violation) {
        alert('Please fill in all the fields.');
        return;
      }
  try {
    const data = {
      full_name: name,
      id_number: id,
      course: course,
      date: date,
      time: time,
      violation: violation,
      image: imageUri,
    };

    const response = await fetch('https://slateblue-gerbil-865863.hostingersite.com/connections/mobileConnection.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      Alert.alert('Success', result.message || 'Record successfully submitted', [
        {
          text: 'OK',
          onPress: () => {
            // Clear the form fields after successful submission
            setName('');
            setId('');
            setCourse('');
            setDate('');
            setTime('');
            setViolation('');
            setVioDate('');
            setIsHomeScreen(true);
            setIsScanning(true);
          },
        },
      ]);
    } else {
      Alert.alert('Error', result.error || 'An error occurred');
    }
  } catch (error) {
    Alert.alert('Error', error.message || 'Something went wrong');
  }
};

  if (isHomeScreen) {

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

        <Picker

          selectedValue={violation}

          onValueChange={(itemValue) => setViolation(itemValue)}

          style={styles.inputViolation}

        >

          <Picker.Item label="  Violation" value="" />

          {violationsList.map((item, index) => (

            <Picker.Item key={index} label={item} value={item} />

          ))}

        </Picker>

        <Text style={styles.arrow}>▼</Text>

        <Button title="Start Scanning" onPress={() => setIsHomeScreen(false)} color="#B59410" />

        <View style={styles.buttonContainer}>

          <Button title="Submit" onPress={handleSubmit} color="#B59410" />

        </View>

        <View style={styles.buttonContainer2}>
          <Button title="Get Violation" onPress={fetchViolationData} color="#B59410" />
        </View>
      </SafeAreaView>

    );

  }



  if (device == null) return <Text>Loading camera...</Text>;



  return (

    <SafeAreaView style={styles.container}>

      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} frameProcessorFps={2} {...props} codeScanner={isScanning ? codeScanner : undefined} />

      <View style={styles.infoContainer}>

        <Text style={styles.infoText}>Point the camera at a code</Text>

      </View>

      <View style={styles.buttonContainer}>

        <Button title="Back to Home" onPress={() => setIsHomeScreen(true)} color="#B59410" />

      </View>

            {violationFetched && (
              <>
                {imageUri ? (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${imageUri}` }} // Displaying base64 image
                    style={{ width: 200, height: 200 }}
                  />
                ) : (
                  <Text>No image found</Text>
                )}

                {violation && <Text>{violation}</Text>}
              </>
            )}


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

    inputViolation: {

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
    arrow: {
        position: 'relative',
        right: -140,
        bottom: 53,
        fontSize: 18,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
      },
    buttonContainer2: {
      position: 'absolute',
      bottom: 80,
      alignItems: 'center',
    },
});



export default App;

