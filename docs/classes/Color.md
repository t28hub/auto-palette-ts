# Class: Color

Color class represents a color in any color space.

## Methods

### chroma

▸ **chroma**(): `number`

Calculate the chroma of the color.

#### Returns

`number`

The chroma of the color.

**`See`**

 - [Color.lightness](Color.md#lightness)
 - [Color.hue](Color.md#hue)

#### Defined in

[color/index.ts:80](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L80)

___

### clone

▸ **clone**(): [`Color`](Color.md)

Clone the color.

#### Returns

[`Color`](Color.md)

The cloned color.

#### Defined in

[color/index.ts:38](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L38)

___

### differenceTo

▸ **differenceTo**(`other`, `formula?`): [`ColorDifference`](../README.md#colordifference)

Compute the color difference between this color and the other color.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `other` | [`Color`](Color.md) | `undefined` | The other color. |
| `formula` | [`DifferenceFunction`](../README.md#differencefunction)\<[`LAB`](../README.md#lab)\> | `ciede2000` | The formula to use to compute the color difference. Default is CIEDE2000. |

#### Returns

[`ColorDifference`](../README.md#colordifference)

The color difference.

#### Defined in

[color/index.ts:102](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L102)

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

#### Defined in

[color/index.ts:91](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L91)

___

### isDark

▸ **isDark**(): `boolean`

Check if the color is dark.

#### Returns

`boolean`

True if the color is dark, false otherwise.

**`See`**

[Color.isLight](Color.md#islight)

#### Defined in

[color/index.ts:58](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L58)

___

### isLight

▸ **isLight**(): `boolean`

Check if the color is light.

#### Returns

`boolean`

True if the color is light, false otherwise.

**`See`**

[Color.isDark](Color.md#isdark)

#### Defined in

[color/index.ts:48](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L48)

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

#### Defined in

[color/index.ts:69](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L69)

___

### toHSL

▸ **toHSL**(): [`HSL`](../README.md#hsl)

Convert the color to HSL color space.

#### Returns

[`HSL`](../README.md#hsl)

The color in HSL color space.

**`See`**

[Color.fromHSL](Color.md#fromhsl)

#### Defined in

[color/index.ts:134](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L134)

___

### toLAB

▸ **toLAB**(): [`LAB`](../README.md#lab)

Convert the color to CIELAB color space.

#### Returns

[`LAB`](../README.md#lab)

The color in CIELAB color space.

**`See`**

[Color.fromLAB](Color.md#fromlab)

#### Defined in

[color/index.ts:145](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L145)

___

### toRGB

▸ **toRGB**(): [`RGB`](../README.md#rgb)

Convert the color to RGB color space.

#### Returns

[`RGB`](../README.md#rgb)

The color in RGB color space.

**`See`**

[Color.fromRGB](Color.md#fromrgb)

#### Defined in

[color/index.ts:123](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L123)

___

### toString

▸ **toString**(): `string`

Return the string representation of the color.

#### Returns

`string`

The string representation of the color.

**`See`**

[Color.fromString](Color.md#fromstring)

#### Defined in

[color/index.ts:112](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L112)

___

### fromHSL

▸ **fromHSL**(`hsl`): [`Color`](Color.md)

Create a new Color instance from the given HSL color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hsl` | [`HSL`](../README.md#hsl) | The HSL color. |

#### Returns

[`Color`](Color.md)

The new Color instance.

**`See`**

[Color.toHSL](Color.md#tohsl)

#### Defined in

[color/index.ts:193](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L193)

___

### fromLAB

▸ **fromLAB**(`lab`): [`Color`](Color.md)

Create a new Color instance from the given CIELAB color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lab` | [`LAB`](../README.md#lab) | The CIELAB color. |

#### Returns

[`Color`](Color.md)

The new Color instance.

**`See`**

[Color.toLAB](Color.md#tolab)

#### Defined in

[color/index.ts:207](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L207)

___

### fromRGB

▸ **fromRGB**(`rgb`): [`Color`](Color.md)

Create a new Color instance from the given RGB color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rgb` | [`RGB`](../README.md#rgb) | The RGB color. |

#### Returns

[`Color`](Color.md)

The new Color instance.

**`See`**

[Color.toRGB](Color.md#torgb)

#### Defined in

[color/index.ts:180](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L180)

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

#### Defined in

[color/index.ts:218](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/color/index.ts#L218)
