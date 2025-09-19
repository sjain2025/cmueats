import './SortBy.css';

interface SortByProps {
    setSortBy: (sortBy: string) => void;
    sortBy: string;
}

function SortBy({ setSortBy, sortBy }: SortByProps) {
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
