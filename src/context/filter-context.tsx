"use client";

import React, { createContext, useContext, useState } from "react";

// Create context
const FilterContext = createContext<{
    filter: {
        from: Date;
        to: Date;
    };
    setFilter: React.Dispatch<
        React.SetStateAction<{
            from: Date;
            to: Date;
        }>
    >;
}>({
    filter: { from: new Date(), to: new Date() },
    setFilter: () => {},
});

// Create a provider component
export const ContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [filter, setFilter] = useState({
        from: new Date(),
        to: new Date(),
    });

    return (
        <FilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </FilterContext.Provider>
    );
};

// Custom hook to use the context
export const useFilterContext = () => useContext(FilterContext);
