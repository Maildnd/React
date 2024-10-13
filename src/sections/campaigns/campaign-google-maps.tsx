import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Circle, Marker, GoogleMap, useLoadScript } from '@react-google-maps/api';

import Box from '@mui/material/Box';
import { Stack, Button, Typography } from '@mui/material';
import Slider, { sliderClasses } from '@mui/material/Slider';

import { Field } from 'src/components/hook-form';

import { getTargetCoordinates } from './context/action';

const API_KEY = 'AIzaSyDGPpU8gDenwxFr9ZCbfQuw-LaJn2sUCeY';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: 10,
  padding: 20,
  borderWidth: 5,
  borderColor: 'red',
};

const initialCenter = {
  lat: 38.9072,
  lng: -77.0369,
};

interface MyGoogleMapProps {
  setCoordinates: (radiusData: { location: { lat: number; lng: number }; radius: number }) => void;
  iCircle: { center: { lat: number; lng: number }; radius: number };
  iShowCircle: boolean;
  residentsCount: number;
  hasError: boolean;
}

const CampaignGoogleMap: React.FC<MyGoogleMapProps> = ({
  setCoordinates,
  iCircle,
  iShowCircle,
  residentsCount,
  hasError,
}) => {
  const [showCircle, setShowCircle] = useState(iShowCircle || false);
  const [center, setCenter] = useState<{ lat: number; lng: number }>();
  const [radius, setRadius] = useState(0);
  const [onLocationChange, setOnLocationChange] = useState(false);
  const [address, setAddress] = useState('');
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
  });

  useEffect(() => {
    if (iCircle.radius !== 0 && !onLocationChange) {
      const setLocation = async () => {
        await setTimeout(() => {
          setCenter(iCircle.center);
          setRadius(iCircle.radius);
        }, 100);
      };
      setLocation();
      setShowCircle(isLoaded);
    }
  }, [onLocationChange, isLoaded, iCircle]);

  const onMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newCenter = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setOnLocationChange(true);
      setCenter(newCenter);

      if (radius === 0) {
        await setTimeout(() => setRadius(1), 10);
        setShowCircle(true);
      } else {
        await setCoordinates({ location: newCenter, radius });
      }
      setShowCircle(true);
    }
  };

  const getAddressCoordinates = async () => {
    try {
      console.log('Address:', address);
      const res = await getTargetCoordinates(address);
      setMarkers([res]);
    } catch (error) {
      console.error(error);
    }
  };

  const clearMarker = () => {
    setMarkers([]);
    setAddress('');
  };

  const onDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newCenter = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setOnLocationChange(true);
      setCenter(newCenter);
      setCoordinates({ location: newCenter, radius });
    }
  };

  const handleRadiusChange = (event: Event, value: number | number[], activeThumb: number) => {
    setOnLocationChange(true);
    setRadius(value as number);
    setCoordinates({ location: center!, radius: value as number });
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Select the location by clicking on the map. And then adjust the radius by using the slider
        below. We will provide real time data of the residents in the target area as you change the
        target area.
      </Typography>

      <Stack spacing={1.5} direction="row" sx={{ mb: { xs: 3, md: 5 }, mt: 3 }}>
        <Field.Text
          name="address"
          label="Address"
          placeholder="Type the address here.."
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />

        <Button
          onClick={getAddressCoordinates}
          variant="outlined"
          sx={{ width: 150, height: 40, mt: 1 }}
        >
          Search
        </Button>
        <Button variant="contained" sx={{ width: 150, height: 40, mt: 1 }} onClick={clearMarker}>
          Clear
        </Button>
      </Stack>
      <Box sx={[{ borderRadius: 2 }, hasError && { border: 2, borderColor: 'red', padding: 0.25 }]}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={initialCenter}
          zoom={10}
          onClick={onMapClick}
          options={{
            zoomControl: true,
            scrollwheel: true,
            disableDoubleClickZoom: false,
            disableDefaultUI: true,
            mapTypeControl: false,
          }}
          mapContainerClassName=""
        >
          {markers.length > 0 &&
            markers.map((marker, index) => <Marker key={index} position={marker} />)}
          {showCircle && (
            <Circle
              key="1"
              center={center}
              radius={radius * 1609.34}
              draggable
              onDragEnd={onDragEnd}
              options={{
                zIndex: 1,
                fillColor: 'blue',
                fillOpacity: 0.2,
                strokeColor: 'blue',
                strokeOpacity: 0.5,
                strokeWeight: 1,
              }}
            />
          )}
        </GoogleMap>
      </Box>
      {hasError && (
        <Typography variant="body2" sx={{ color: 'red', mt: 1 }}>
          A location and radius are required if the target type is Map.
        </Typography>
      )}

      {showCircle && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Adjust Radius (miles): {radius}
          </Typography>
          <Slider
            defaultValue={radius}
            value={radius}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={10}
            sx={{ [`& .${sliderClasses.mark}[data-index="10"]`]: { display: 'none' } }}
            onChange={handleRadiusChange}
          />

          <Typography variant="body1" sx={{ mt: 1 }}>
            Residents in the target area: {residentsCount}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default CampaignGoogleMap;
