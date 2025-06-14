"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, FilterIcon, Clock, DollarSign, Train } from "lucide-react"
import { type CarriageType, getCarriageTypeLabel } from "@/app/types/carriage"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

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
    departureTimeRange: [0, 24],
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Update price range when props change
  useEffect(() => {
    if (minPrice !== undefined && maxPrice !== undefined) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [minPrice, maxPrice],
      }))
    }
  }, [minPrice, maxPrice])

  // Count active filters
  useEffect(() => {
    let count = 0
    if (filters.carriageTypes.length > 0) count++
    if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) count++
    if (filters.departureTimeRange[0] !== 0 || filters.departureTimeRange[1] !== 24) count++
    setActiveFiltersCount(count)
  }, [filters, minPrice, maxPrice])

  const handleCarriageTypeChange = (type: CarriageType, checked: boolean) => {
    const newTypes = checked ? [...filters.carriageTypes, type] : filters.carriageTypes.filter((t) => t !== type)

    const newFilters = { ...filters, carriageTypes: newTypes }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (value: number[]) => {
    const newFilters = {
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleTimeChange = (value: number[]) => {
    const newFilters = {
      ...filters,
      departureTimeRange: [value[0], value[1]] as [number, number],
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters = {
      carriageTypes: [],
      priceRange: [minPrice, maxPrice] as [number, number],
      departureTimeRange: [0, 24] as [number, number],
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

  // Define carriage types explicitly
  const carriageTypesList: CarriageType[] = [
    "soft_seat",
    "soft_seat_ac",
    "hard_seat",
    "soft_sleeper",
    "hard_sleeper",
    "vip",
  ]

  const getCarriageIcon = (type: CarriageType) => {
    switch (type) {
      case "vip":
        return "⭐"
      case "soft_sleeper":
      case "hard_sleeper":
        return "🛏️"
      default:
        return "💺"
    }
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FilterIcon className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Bộ lọc tìm kiếm</CardTitle>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                  {activeFiltersCount} bộ lọc đang áp dụng
                </Badge>
              )}
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa tất cả
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Carriage Type Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 text-gray-600" />
            <Label className="text-base font-semibold text-gray-900">Loại toa</Label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {carriageTypesList.map((type) => (
              <div
                key={type}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all hover:bg-gray-50 ${
                  filters.carriageTypes.includes(type) ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                }`}
              >
                <Checkbox
                  id={type}
                  checked={filters.carriageTypes.includes(type)}
                  onCheckedChange={(checked) => handleCarriageTypeChange(type, checked as boolean)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-lg">{getCarriageIcon(type)}</span>
                  <Label htmlFor={type} className="text-sm font-medium cursor-pointer flex-1">
                    {getCarriageTypeLabel(type)}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-600" />
            <Label className="text-base font-semibold text-gray-900">Khoảng giá</Label>
          </div>
          <div className="px-3 py-4 bg-gray-50 rounded-lg">
            <Slider
              min={minPrice}
              max={maxPrice}
              step={50000}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              className="mb-4"
            />
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Từ</div>
                <Badge variant="outline" className="bg-white font-semibold">
                  {formatPrice(filters.priceRange[0])}đ
                </Badge>
              </div>
              <div className="h-px bg-gray-300 flex-1 mx-3"></div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Đến</div>
                <Badge variant="outline" className="bg-white font-semibold">
                  {formatPrice(filters.priceRange[1])}đ
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Departure Time Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <Label className="text-base font-semibold text-gray-900">Giờ khởi hành</Label>
          </div>
          <div className="px-3 py-4 bg-gray-50 rounded-lg">
            <Slider
              min={0}
              max={24}
              step={1}
              value={filters.departureTimeRange}
              onValueChange={handleTimeChange}
              className="mb-4"
            />
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Từ</div>
                <Badge variant="outline" className="bg-white font-semibold">
                  {formatTime(filters.departureTimeRange[0])}
                </Badge>
              </div>
              <div className="h-px bg-gray-300 flex-1 mx-3"></div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Đến</div>
                <Badge variant="outline" className="bg-white font-semibold">
                  {formatTime(filters.departureTimeRange[1])}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Time Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Lọc nhanh theo giờ</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTimeChange([6, 12])}
              className="text-xs hover:bg-green-50 hover:border-green-300"
            >
              🌅 Sáng sớm (6h-12h)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTimeChange([12, 18])}
              className="text-xs hover:bg-green-50 hover:border-green-300"
            >
              ☀️ Chiều (12h-18h)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTimeChange([18, 24])}
              className="text-xs hover:bg-green-50 hover:border-green-300"
            >
              🌙 Tối (18h-24h)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTimeChange([0, 6])}
              className="text-xs hover:bg-green-50 hover:border-green-300"
            >
              🌃 Đêm (0h-6h)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
