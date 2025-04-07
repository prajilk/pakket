import { TableCell, TableRow } from "../ui/table";

type ItemRowProps = {
    url: string;
    title: string;
    itemId: string;
    unit: string;
    priceAtOrder: number;
    quantity: number;
    totalPrice: string;
};

const ItemRow = ({
    itemId,
    priceAtOrder,
    quantity,
    totalPrice,
    title,
    unit,
    url,
}: ItemRowProps) => {
    return (
        <TableRow>
            <TableCell>
                <img
                    src={url}
                    alt={title}
                    width={80}
                    height={80}
                    className="object-cover rounded-md"
                />
            </TableCell>
            <TableCell>
                <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">
                        ID: {itemId}
                    </p>
                </div>
            </TableCell>
            <TableCell>{unit}</TableCell>
            <TableCell className="text-right">${priceAtOrder}</TableCell>
            <TableCell className="text-right">{quantity}</TableCell>
            <TableCell className="font-medium text-right">
                {totalPrice}
            </TableCell>
        </TableRow>
    );
};

export default ItemRow;
