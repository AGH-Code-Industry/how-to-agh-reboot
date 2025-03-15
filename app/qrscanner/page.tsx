'use client';

import { useState } from "react";
import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";

const styles = {
  container: {
    width: 400,
    margin: "auto",
  },
  controls: {
    marginBottom: 8,
  },
};

export default function QRScanner() {
  // return <div>Skaner</div>
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("outline");
  const [pause, setPause] = useState(false);

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

  const handleScan = async (data: string) => {
    setPause(true);
    // try {
    //   const response = await fetch(
    //     `your-api-url?code=${encodeURIComponent(data)}`
    //   );
    //   const result = await response.json();

    //   if (response.ok && result.success) {
    //     alert("Success! Welcome to the conference.");
    //   } else {
    //     alert(result.message);
    //   }
    // } catch (error: unknown) {
    //   console.log(error);
    // } finally {
    //   setPause(false);
    // }
    console.log(`Scan complete: ${data}`);
  };

  return (
    <div style={{margin: 'auto', width: '400px', textAlign: 'center'}}>
      <div style={styles.controls}>
        <select onChange={(e) => setDeviceId(e.target.value)}>
          <option value={undefined}>Select a device</option>
          {devices.map((device, index) => (
            <option key={index} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
        <select
          style={{ marginLeft: 5 }}
          onChange={(e) => setTracker(e.target.value)}
        >
          <option value="centerText">Center Text</option>
          <option value="outline">Outline</option>
          <option value="boundingBox">Bounding Box</option>
          <option value={undefined}>No Tracker</option>
        </select>
      </div>
      <Scanner
        formats={[
          "qr_code",
          "micro_qr_code",
          "rm_qr_code",
          "maxi_code",
          "pdf417",
          "aztec",
          "data_matrix",
          "matrix_codes",
          "dx_film_edge",
          "databar",
          "databar_expanded",
          "codabar",
          "code_39",
          "code_93",
          "code_128",
          "ean_8",
          "ean_13",
          "itf",
          "linear_codes",
          "upc_a",
          "upc_e",
        ]}
        constraints={{
          deviceId: deviceId,
        }}
        onScan={(detectedCodes) => {
          handleScan(detectedCodes[0].rawValue);
        }}
        onError={(error) => {
          console.log(`onError: ${error}'`);
        }}
        // styles={{ container: { height: "350px", width: "400px" } }}
        components={{
          audio: true,
          onOff: true,
          torch: true,
          zoom: true,
          finder: true,
          tracker: getTracker(),
        }}
        allowMultiple={true}
        scanDelay={2000}
        paused={pause}
      />
    </div>
  );
}
