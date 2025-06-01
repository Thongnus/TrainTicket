export enum CarriageType {
  SOFT_SEAT = "soft_seat",
  HARD_SEAT = "hard_seat",
  SOFT_SLEEPER = "soft_sleeper",
  HARD_SLEEPER = "hard_sleeper",
  VIP = "vip"
}

export const getCarriageTypeLabel = (type: CarriageType): string => {
  switch (type) {
    case CarriageType.SOFT_SEAT:
      return "Ghế mềm"
    case CarriageType.HARD_SEAT:
      return "Ghế cứng"
    case CarriageType.SOFT_SLEEPER:
      return "Giường nằm mềm"
    case CarriageType.HARD_SLEEPER:
      return "Giường nằm cứng"
    case CarriageType.VIP:
      return "VIP"
    default:
      return type
  }
}

export const toCarriageType = (value: string): CarriageType => {
  switch (value) {
    case CarriageType.SOFT_SEAT:
      return CarriageType.SOFT_SEAT
    case CarriageType.HARD_SEAT:
      return CarriageType.HARD_SEAT
    case CarriageType.SOFT_SLEEPER:
      return CarriageType.SOFT_SLEEPER
    case CarriageType.HARD_SLEEPER:
      return CarriageType.HARD_SLEEPER
    case CarriageType.VIP:
      return CarriageType.VIP
    default:
      return CarriageType.SOFT_SEAT // Default fallback
  }
} 