import { useEffect } from 'react';
import './SortBy.css';
import { getUserToDestinationPath } from '../util/cmuMapsApi';
import { IReadOnlyLocation_FromAPI_PostProcessed } from '../types/locationTypes';

interface SortByProps {
    setSortBy: (sortBy: string) => void;
    sortBy: string;
    locations?: IReadOnlyLocation_FromAPI_PostProcessed[];
    onLocationDistancesCalculated?: (distances: Map<number, number>) => void;
}

function SortBy({ setSortBy, sortBy, locations, onLocationDistancesCalculated }: SortByProps) {
    useEffect(() => {
        if (sortBy === 'location' && locations && onLocationDistancesCalculated) {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        const distances = new Map<number, number>();
                        
                        for (const location of locations) {
                            if (location.coordinates) {
                                try {
                                    const pathData = await getUserToDestinationPath(
                                        latitude,
                                        longitude,
                                        location.coordinates.lat,
                                        location.coordinates.lng
                                    );
                                    
                                    if (pathData) {
                                        distances.set(location.conceptId, pathData.Fastest.path.distance);
                                    }
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        }
                        
                        onLocationDistancesCalculated(distances);
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            } else {
                console.error('error');
            }
        }
    }, [sortBy, locations, onLocationDistancesCalculated]);

    return (
        <div className="sort-container">
            <span className="sort-label">Sort by:</span>
            <select 
                onChange={(e) => setSortBy(e.target.value)} 
                value={sortBy}
                className="select sort-select"
            >
                <option value="closing-time">Closing time</option>
                <option value="location">Location</option>
            </select>
        </div>
    );
}

export default SortBy;
