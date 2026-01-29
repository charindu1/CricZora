import { useEffect, useRef, useState } from "react";
import './AutoSelect.css'

export default function AutoSelect({ label, options, value, onChange }) {
    const [query, setQuery] = useState("")
    const [showDropdown, setShowDropdown] = useState(false)

    // Track which item is currently highlighted via keyboard
    const [highlightedIndex, setHighlightedIndex] = useState(0)

    // When click an option, the input loses focus (Blur) BEFORE the click registers.
    // We use this flag to tell the Blur event "Wait! Don't close yet, the user is clicking."
    const isSelecting = useRef(false)

    // Used to physically scroll dropdown (scrolling logic) list when using arrow keys 
    const dropdownRef = useRef(null) 

    // If the parent component change the 'value' prop, update the textbox 
    useEffect(()=>{
        setQuery(value)
    }, [value])

    // create the list of matches based on what user typed
    const filtered = options.filter(o =>
        o.toLowerCase().includes(query.toLowerCase())
    ) 

    // whenever user types a letter snap highlight back to the index 0
    useEffect(()=>{
        setHighlightedIndex(0)
    }, [query]);

    // scroll the highlighted item into view automatically
    useEffect(()=>{
        if (showDropdown && dropdownRef.current) {
            const activeItem = dropdownRef.current.children[highlightedIndex]
            if (activeItem) {
                activeItem.scrollIntoView({ block: "nearest" })
            }
        }
    }, [highlightedIndex, showDropdown])

    // helper function to finalize a section
    const selectOption = (val) => {
        onChange(val); // tell parent component
        setQuery(val); // update the textbox
        setShowDropdown(false); // close menu
        isSelecting.current = false;
        setHighlightedIndex(0); // rest index for next time
    }

    // initialize custom keyboard navigations
    const handleKeyDown = (e) => {
        if (!showDropdown) return;

        if (e.key === "ArrowDown") {
            e.preventDefault(); // stop cursor from moving in the textbox
            // increment index(move down), but stop at the last item
            setHighlightedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            // decrement index(move up), but stop at the first item
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        }
        else if (e.key === "Enter") {
            e.preventDefault(); // stop form submission
            // select the currently highlighted item
            if (filtered.length > 0) {
                selectOption(filtered[highlightedIndex]);
            }
        }
    }

    return (
        <div className="auto-select">
            <label>{label}</label>

            <input
                value={query}
                placeholder={`Select ${label}`}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)} // open when user click inside
                onKeyDown={handleKeyDown} // attach the new keyboard handler

                // the blur trick
                onBlur={() => {
                    setTimeout(() => {
                        if (!isSelecting.current) {
                            if (filtered.length > 0) {
                                // if user tabs away, it will select top item
                                // default the currently highlighted item (usually 0/top)
                                selectOption(filtered[highlightedIndex] || filtered[0]);
                            } else {
                                setShowDropdown(false);
                            }
                        }
                        isSelecting.current = false;
                    }, 200);
                }}
            />

            {showDropdown && filtered.length > 0 && (
                <div 
                    ref={dropdownRef} // attach ref here for enable scrolling
                    className="dropdown"
                >
                    {filtered.map((o, i) => (
                        <div 
                            key={i}
                            className={`option ${i === highlightedIndex ? "active" : ""}`}
                
                            // this runs before the input is 'onblur'
                            onMouseDown={() => {
                                isSelecting.current = true; // tell the blur handler 'wait!'
                                selectOption(o);
                            }}
                            // updates highlight when moving mouse
                            onMouseEnter={() => setHighlightedIndex(i)}
                        >
                            {o}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}