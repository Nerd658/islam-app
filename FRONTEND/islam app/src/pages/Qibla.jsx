import React, { useState, useEffect } from 'react';
import { Compass, MapPin, AlertTriangle } from 'lucide-react';

export default function Qibla() {
    const [qiblaAngle, setQiblaAngle] = useState(null);
    const [heading, setHeading] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [needsPermission, setNeedsPermission] = useState(false);

    const KAABA_LAT = 21.422487;
    const KAABA_LNG = 39.826206;

    const calculateQibla = (lat, lng) => {
        const PI = Math.PI;
        const meccaLat = KAABA_LAT * (PI / 180);
        const meccaLng = KAABA_LNG * (PI / 180);
        const userLat = lat * (PI / 180);
        const userLng = lng * (PI / 180);

        const dLng = meccaLng - userLng;
        const y = Math.sin(dLng);
        const x = Math.cos(userLat) * Math.tan(meccaLat) - Math.sin(userLat) * Math.cos(dLng);

        let qibla = Math.atan2(y, x) * (180 / PI);
        if (qibla < 0) {
            qibla += 360;
        }
        return qibla;
    };

    const handleOrientation = (e) => {
        // webkitCompassHeading is for iOS, alpha is for Android
        let compassHeading = e.webkitCompassHeading || Math.abs(e.alpha - 360);
        if (compassHeading) {
            setHeading(compassHeading);
        }
    };

    const requestOrientationPermission = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceOrientationEvent.requestPermission();
                if (permissionState === 'granted') {
                    setNeedsPermission(false);
                    window.addEventListener('deviceorientation', handleOrientation, true);
                } else {
                    setError('Permission refusée pour la boussole.');
                }
            } catch (err) {
                console.error(err);
                setError('Erreur lors de la demande d\'autorisation.');
            }
        } else {
            // Non-iOS 13+ devices
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
            window.addEventListener('deviceorientation', handleOrientation, true);
            setNeedsPermission(false);
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Géolocalisation non supportée.');
            return;
        }
        setLoading(true);
        setError('');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const angle = calculateQibla(lat, lng);
                setQiblaAngle(angle);
                setLoading(false);

                // Check if we need explicit permission (iOS 13+)
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    setNeedsPermission(true);
                } else {
                    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
                    window.addEventListener('deviceorientation', handleOrientation, true);
                }
            },
            (err) => {
                setError('Impossible d\'obtenir votre position.');
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientationabsolute', handleOrientation);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    // Calculate the arrow rotation relative to the phone's heading
    // If heading is true north (0), and Qibla is 90 (East), arrow should point 90.
    // If phone turns 90 (East), heading=90, arrow should point 0 (straight ahead).
    const compassRotation = qiblaAngle !== null ? qiblaAngle - heading : 0;
    
    // Smooth the display logic
    const isAligned = qiblaAngle !== null && Math.abs(compassRotation % 360) < 5;

    return (
        <div className="pt-8 px-4 max-w-lg mx-auto flex flex-col items-center min-h-[80vh] justify-center">
            <h2 className="text-3xl font-bold text-center mb-8 text-white flex items-center gap-3">
                <Compass size={32} /> Boussole Qibla
            </h2>

            {qiblaAngle === null ? (
                <div className="flex flex-col items-center bg-[#0a0a0a] p-8 rounded-[2rem] border border-[#333] text-center max-w-sm">
                    <MapPin size={48} className="text-gray-400 mb-6" />
                    <p className="text-gray-300 mb-8">
                        Pour indiquer la direction de la Mecque, nous avons besoin de votre position.
                    </p>
                    <button 
                        onClick={getLocation}
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Recherche...' : 'Localiser ma position'}
                    </button>
                    {error && (
                        <div className="mt-4 text-red-400 flex items-center gap-2 text-sm bg-red-950/30 p-3 rounded-lg">
                            <AlertTriangle size={16} /> {error}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center w-full">
                    {needsPermission ? (
                        <button 
                            onClick={requestOrientationPermission}
                            className="mb-8 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Autoriser la boussole
                        </button>
                    ) : (
                        <p className="text-gray-400 mb-12 text-center text-sm">
                            Tournez votre téléphone pour aligner la flèche.
                        </p>
                    )}

                    <div className="relative w-72 h-72 rounded-full border-4 border-[#333] bg-[#0a0a0a] flex items-center justify-center shadow-2xl overflow-hidden">
                        {/* Direction markers */}
                        <div className="absolute top-4 font-bold text-gray-500">N</div>
                        <div className="absolute bottom-4 font-bold text-gray-500">S</div>
                        <div className="absolute right-4 font-bold text-gray-500">E</div>
                        <div className="absolute left-4 font-bold text-gray-500">W</div>

                        {/* Outer Compass Ring Rotating */}
                        <div 
                            className="absolute inset-0 transition-transform duration-200 ease-out flex items-center justify-center"
                            style={{ transform: `rotate(${-heading}deg)` }}
                        >
                            {/* Inner Qibla Marker (Absolute to North) */}
                            <div 
                                className="absolute w-2 h-full py-2"
                                style={{ transform: `rotate(${qiblaAngle}deg)` }}
                            >
                                <div className="w-4 h-4 bg-emerald-500 rounded-full mx-auto -mt-2 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                            </div>
                        </div>

                        {/* Center Arrow indicating Qibla relative to phone */}
                        <div 
                            className="transition-transform duration-200 ease-out z-10 flex flex-col items-center"
                            style={{ transform: `rotate(${compassRotation}deg)` }}
                        >
                            <div className={`w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[60px] ${isAligned ? 'border-b-emerald-500' : 'border-b-white'} mb-1 transition-colors duration-300`}></div>
                            <div className={`w-8 h-8 ${isAligned ? 'bg-emerald-500' : 'bg-white'} rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-colors duration-300`}></div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-4xl font-mono font-bold text-white mb-2">
                            {Math.round(qiblaAngle)}°
                        </p>
                        <p className={`font-bold text-lg transition-colors duration-300 ${isAligned ? 'text-emerald-500' : 'text-gray-400'}`}>
                            {isAligned ? "Vous faites face à la Qibla !" : "Direction de la Qibla"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
