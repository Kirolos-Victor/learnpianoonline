import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface TablePaginationProps {
    data: PaginationData;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    showPerPageSelector?: boolean;
    className?: string;
}

export const TablePagination = ({
    data,
    onPageChange,
    onPerPageChange,
    showPerPageSelector = true,
    className = ''
}: TablePaginationProps) => {
    const { current_page, last_page, total, from, to, per_page } = data;

    if (total === 0) return null;

    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 5;

        if (last_page <= maxVisible) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (current_page <= 3) {
                // Near the beginning
                pages.push(2, 3, 4);
                if (last_page > 4) pages.push('...');
            } else if (current_page >= last_page - 2) {
                // Near the end
                if (last_page > 4) pages.push('...');
                pages.push(last_page - 3, last_page - 2, last_page - 1);
            } else {
                // In the middle
                pages.push('...', current_page - 1, current_page, current_page + 1, '...');
            }

            // Always show last page (if not already included)
            if (!pages.includes(last_page) && last_page > 1) {
                pages.push(last_page);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {/* Results info */}
            <div className="text-sm text-muted-foreground">
                Showing {from || 0} to {to || 0} of {total} results
            </div>

            <div className="flex items-center gap-4">
                {/* Per page selector */}
                {showPerPageSelector && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Per page:</span>
                        <Select value={per_page.toString()} onValueChange={(value) => onPerPageChange(Number(value))}>
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Pagination controls */}
                <div className="flex items-center gap-1">
                    {/* Previous button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(current_page - 1)}
                        disabled={current_page === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page numbers */}
                    {visiblePages.map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <div className="flex h-8 w-8 items-center justify-center">
                                    <MoreHorizontal className="h-4 w-4" />
                                </div>
                            ) : (
                                <Button
                                    variant={current_page === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(Number(page))}
                                    className="h-8 w-8 p-0"
                                >
                                    {page}
                                </Button>
                            )}
                        </div>
                    ))}

                    {/* Next button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(current_page + 1)}
                        disabled={current_page === last_page}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TablePagination;
