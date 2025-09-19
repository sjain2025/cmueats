import { useEffect } from 'react';
import './SortBy.css';

interface SortByProps {
    setSortBy: (sortBy: string) => void;
    sortBy: string;
}

function SortBy({ setSortBy, sortBy }: SortByProps) {
    useEffect(() => {
        if (sortBy === 'location') {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log({ latitude, longitude });
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            } else {
                console.error('error');
            }
        }
    }, [sortBy]);

    return (
        <select 
            onChange={(e) => setSortBy(e.target.value)} 
            value={sortBy}
            className="select sort-select"
        >
            <option value="" label="Sort by" />
            <option value="closing-time">Closing time</option>
            <option value="location">Location</option>
        </select>
    );
}

export default SortBy;
