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

                        const pathPromises = locations
                            .filter((location) => location.coordinates)
                            .map(async (location) => {
                                try {
                                    const pathData = await getUserToDestinationPath(
                                        latitude,
                                        longitude,
                                        location.coordinates!.lat,
                                        location.coordinates!.lng,
                                    );

                                    if (pathData) {
                                        return {
                                            conceptId: location.conceptId,
                                            distance: pathData.Fastest.path.distance,
                                        };
                                    }
                                    return null;
                                } catch (error) {
                                    return null;
                                }
                            });

                        const pathResults = await Promise.all(pathPromises);
                        pathResults.forEach((result) => {
                            if (result) {
                                distances.set(result.conceptId, result.distance);
                            }
                        });

                        onLocationDistancesCalculated(distances);
                    },
                    () => {
                    },
                );
            } else {
            }
        }
    }, [sortBy, locations, onLocationDistancesCalculated]);

    return (
        <div className="sort-container">
            <span className="sort-label">Sort by:</span>
            <select onChange={(e) => setSortBy(e.target.value)} value={sortBy} className="select sort-select">
                <option value="closing-time">Closing time</option>
                <option value="location">Location</option>
            </select>
        </div>
    );
}

export default SortBy;
