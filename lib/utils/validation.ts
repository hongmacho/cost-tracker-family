export type ValidationError = {
  field: string
  message: string
}

export function validateGroupName(name: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!name || name.trim().length === 0) {
    errors.push({ field: 'name', message: '그룹명은 필수입니다' })
  } else if (name.length > 100) {
    errors.push({ field: 'name', message: '그룹명은 100자 이내여야 합니다' })
  }

  return errors
}

export function validateMemberName(name: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!name || name.trim().length === 0) {
    errors.push({ field: 'name', message: '멤버명은 필수입니다' })
  } else if (name.length > 50) {
    errors.push({ field: 'name', message: '멤버명은 50자 이내여야 합니다' })
  }

  return errors
}

export function validateExpenseDescription(description: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!description || description.trim().length === 0) {
    errors.push({ field: 'description', message: '항목명은 필수입니다' })
  } else if (description.length > 200) {
    errors.push({ field: 'description', message: '항목명은 200자 이내여야 합니다' })
  }

  return errors
}

export function validateExpenseAmount(amount: number | string): ValidationError[] {
  const errors: ValidationError[] = []
  const num = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(num) || num <= 0) {
    errors.push({ field: 'amount', message: '금액은 0보다 커야 합니다' })
  } else if (num > 999999999) {
    errors.push({ field: 'amount', message: '금액이 너무 큽니다' })
  }

  return errors
}

export function validateExpenseSplits(
  participants: string[],
  amount: number
): ValidationError[] {
  const errors: ValidationError[] = []

  if (participants.length < 2) {
    errors.push({
      field: 'participants',
      message: '참여자는 최소 2명 이상이어야 합니다',
    })
  }

  return errors
}

export function hasValidationErrors(errors: ValidationError[]): boolean {
  return errors.length > 0
}

export function getErrorMessage(field: string, errors: ValidationError[]): string | undefined {
  return errors.find((e) => e.field === field)?.message
}
