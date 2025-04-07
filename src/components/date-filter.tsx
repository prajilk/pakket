import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Button } from "@heroui/button";
import { Filter } from "lucide-react";

const DateFilter = ({
    date,
    onSelect,
    footer,
}: {
    date: Date;
    onSelect: (date: Date) => void;
    footer?: string;
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    startContent={<Filter className="w-4 h-4" />}
                    size="sm"
                    variant="bordered"
                    className="bg-white border border-dashed rounded-md shadow-sm h-9"
                >
                    Filter by date
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="single"
                    defaultMonth={date}
                    selected={date || new Date()}
                    required
                    onSelect={(date) => onSelect(date as Date)}
                    footer={
                        <span className="text-xs text-muted-foreground">
                            {footer +
                                " " +
                                format(date || new Date(), "yyyy-MM-dd")}
                        </span>
                    }
                />
            </PopoverContent>
        </Popover>
    );
};

export default DateFilter;
