# Class: Color

Color class represents a color in any color space.

## Table of contents

### Methods

- [clone](Color.md#clone)
- [isLight](Color.md#islight)
- [isDark](Color.md#isdark)
- [lightness](Color.md#lightness)
- [chroma](Color.md#chroma)
- [hue](Color.md#hue)
- [differenceTo](Color.md#differenceto)
- [toString](Color.md#tostring)
- [toRGB](Color.md#torgb)
- [toHSL](Color.md#tohsl)
- [toLAB](Color.md#tolab)
- [fromRGB](Color.md#fromrgb)
- [fromHSL](Color.md#fromhsl)
- [fromLAB](Color.md#fromlab)
- [fromString](Color.md#fromstring)

## Methods

### clone

▸ **clone**(): [`Color`](Color.md)

Clone the color.

#### Returns

[`Color`](Color.md)

The cloned color.

___

### isLight

▸ **isLight**(): `boolean`

Check if the color is light.

#### Returns

`boolean`

True if the color is light, false otherwise.

**`See`**

[Color.isDark](Color.md#isdark)

___

### isDark

▸ **isDark**(): `boolean`

Check if the color is dark.

#### Returns

`boolean`

True if the color is dark, false otherwise.

**`See`**

[Color.isLight](Color.md#islight)

___

### lightness

▸ **lightness**(): `number`

Calculate the lightness of the color.

#### Returns

`number`

The lightness of the color.

**`See`**

 - [Color.chroma](Color.md#chroma)
 - [Color.hue](Color.md#hue)

___

### chroma

▸ **chroma**(): `number`

Calculate the chroma of the color.

#### Returns

`number`

The chroma of the color.

**`See`**

 - [Color.lightness](Color.md#lightness)
 - [Color.hue](Color.md#hue)

___

### hue

▸ **hue**(): `number`

Calculate the hue of the color.

#### Returns

`number`

The hue of the color.

**`See`**

 - [Color.lightness](Color.md#lightness)
 - [Color.chroma](Color.md#chroma)

___

### differenceTo

▸ **differenceTo**(`other`, `formula?`): [`ColorDifference`](../README.md#colordifference)

Compute the color difference between this color and the other color.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `other` | [`Color`](Color.md) | `undefined` | The other color. |
| `formula` | [`DifferenceFunction`](../README.md#differencefunction)\<`LAB`\> | `ciede2000` | The formula to use to compute the color difference. Default is CIEDE2000. |

#### Returns

[`ColorDifference`](../README.md#colordifference)

The color difference.

___

### toString

▸ **toString**(): `string`

Return the string representation of the color.

#### Returns

`string`

The string representation of the color.

**`See`**

[Color.fromString](Color.md#fromstring)

___

### toRGB

▸ **toRGB**(): `RGB`

Convert the color to RGB color space.

#### Returns

`RGB`

The color in RGB color space.

**`See`**

[Color.fromRGB](Color.md#fromrgb)

___

### toHSL

▸ **toHSL**(): `HSL`

Convert the color to HSL color space.

#### Returns

`HSL`

The color in HSL color space.

**`See`**

[Color.fromHSL](Color.md#fromhsl)

___

### toLAB

▸ **toLAB**(): `LAB`

Convert the color to CIELAB color space.

#### Returns

`LAB`

The color in CIELAB color space.

**`See`**

[Color.fromLAB](Color.md#fromlab)

___

### fromRGB

▸ **fromRGB**(`rgb`): [`Color`](Color.md)

Create a new Color instance from the given RGB color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rgb` | `RGB` | The RGB color. |

#### Returns

[`Color`](Color.md)

The new Color instance.

**`See`**

[Color.toRGB](Color.md#torgb)

___

### fromHSL

▸ **fromHSL**(`hsl`): [`Color`](Color.md)

Create a new Color instance from the given HSL color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hsl` | `HSL` | The HSL color. |

#### Returns

[`Color`](Color.md)

The new Color instance.

**`See`**

[Color.toHSL](Color.md#tohsl)

___

### fromLAB

▸ **fromLAB**(`lab`): [`Color`](Color.md)

Create a new Color instance from the given CIELAB color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lab` | `LAB` | The CIELAB color. |

#### Returns

[`Color`](Color.md)

The new Color instance.

**`See`**

[Color.toLAB](Color.md#tolab)

___

### fromString

▸ **fromString**(`value`): [`Color`](Color.md)

Create a new Color instance from the given string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to parse. |

#### Returns

[`Color`](Color.md)

The new Color instance.

**`See`**

[Color.toString](Color.md#tostring)
