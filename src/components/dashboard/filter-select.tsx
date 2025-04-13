"use client";

import { DateRange } from "react-day-picker";
import { DateRangePicker } from "../ui/date-range-picker";
import { useFilterContext } from "@/context/filter-context";

const FilterSelect = () => {
    const { filter, setFilter } = useFilterContext();
    function handleChange(values: { range: DateRange }) {
        setFilter({
            from: values.range.from || new Date(),
            to: values.range.to || new Date(),
        });
    }

    return (
        <DateRangePicker
            onUpdate={handleChange}
            initialDateFrom={filter.from}
            initialDateTo={filter.to}
        />
    );
};

export default FilterSelect;
