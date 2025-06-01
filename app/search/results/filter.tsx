import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { CarriageType, getCarriageTypeLabel } from "@/app/types/carriage"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterProps {
  onFilterChange: (filters: FilterState) => void
  minPrice: number
  maxPrice: number
}

export interface FilterState {
  carriageTypes: CarriageType[]
  priceRange: [number, number]
  departureTimeRange: [number, number]
}

export function Filter({ onFilterChange, minPrice, maxPrice }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    carriageTypes: [],
    priceRange: [minPrice, maxPrice],
    departureTimeRange: [0, 24], // 24 hours
  })

  const handleCarriageTypeChange = (type: CarriageType, checked: boolean) => {
    const newTypes = checked
      ? [...filters.carriageTypes, type]
      : filters.carriageTypes.filter(t => t !== type)
    
    const newFilters = { ...filters, carriageTypes: newTypes }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (value: number[]) => {
    const newFilters = { 
      ...filters, 
      priceRange: [value[0], value[1]] as [number, number]
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleTimeChange = (value: number[]) => {
    const newFilters = { 
      ...filters, 
      departureTimeRange: [value[0], value[1]] as [number, number]
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters = {
      carriageTypes: [],
      priceRange: [minPrice, maxPrice],
      departureTimeRange: [0, 24],
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price)
  }

  const formatTime = (hour: number) => {
    return format(new Date().setHours(hour, 0, 0, 0), "HH:mm", { locale: vi })
  }

  return (
    <Card className="p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bộ lọc tìm kiếm</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        </div>

        {/* Carriage Type Filter */}
        <div className="space-y-2">
          <Label className="text-base">Loại toa</Label>
          <div className="space-y-2">
            {Object.values(CarriageType).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.carriageTypes.includes(type)}
                  onCheckedChange={(checked) => handleCarriageTypeChange(type, checked as boolean)}
                />
                <Label htmlFor={type} className="text-sm font-normal">
                  {getCarriageTypeLabel(type)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2">
          <Label className="text-base">Khoảng giá</Label>
          <div className="px-2">
            <Slider
              min={minPrice}
              max={maxPrice}
              step={100000}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatPrice(filters.priceRange[0])}đ</span>
              <span>{formatPrice(filters.priceRange[1])}đ</span>
            </div>
          </div>
        </div>

        {/* Departure Time Filter */}
        <div className="space-y-2">
          <Label className="text-base">Giờ khởi hành</Label>
          <div className="px-2">
            <Slider
              min={0}
              max={24}
              step={1}
              value={filters.departureTimeRange}
              onValueChange={handleTimeChange}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(filters.departureTimeRange[0])}</span>
              <span>{formatTime(filters.departureTimeRange[1])}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 