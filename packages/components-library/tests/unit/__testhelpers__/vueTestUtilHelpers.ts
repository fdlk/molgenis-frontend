import { WrapperArray } from '@vue/test-utils'

/**
 * Given a WrapperArray logs the text content for each item in the array
 * @param items
 * @param context optional tag to prepend to log message
 */
export const logWrapperArray = (items: WrapperArray<Vue>, context?: string) => {
  const prefix = context ? context + ': ' : ''
  for (let i = 0; i < items.length; i++) {
    console.log(prefix + items.at(i).text())
  }
}

/**
 * Given a WrapperArray and string returns the item from the array that contains the text value as it's text
 * If no item is found with matching text it returns undefined
 * If multiple items a found with matching text it also return undefined
 * @param items
 * @param context optional tag to prepend to log message
 */
export const findItemByText = (items: WrapperArray<Vue>, text: string) => {
  const filtered = items.filter(i => i.text() === text)
  return filtered.length === 1 ? filtered.at(0) : undefined
}
