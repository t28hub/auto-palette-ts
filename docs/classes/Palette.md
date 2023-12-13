# Class: Palette

Palette class represents a color palette.

## Constructors

### constructor

• **new Palette**(`swatches`): [`Palette`](Palette.md)

Create a new Palette instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swatches` | [`Swatch`](../interfaces/Swatch.md)[] | The swatches of the palette. |

#### Returns

[`Palette`](Palette.md)

**`See`**

[Palette.extract](Palette.md#extract)

#### Defined in

[palette.ts:94](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/palette.ts#L94)

## Methods

### findSwatches

▸ **findSwatches**(`n`, `theme?`): [`Swatch`](../interfaces/Swatch.md)[]

Find the best swatches from the palette.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `n` | `number` | The number of swatches to find. |
| `theme?` | [`Theme`](../README.md#theme) | The theme of the swatches. |

#### Returns

[`Swatch`](../interfaces/Swatch.md)[]

The best swatches. If the palette is empty, an empty array is returned.

**`Throws`**

If the number of swatches to find is not an integer or less than 0.

#### Defined in

[palette.ts:127](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/palette.ts#L127)

___

### isEmpty

▸ **isEmpty**(): `boolean`

Check whether the palette is empty.

#### Returns

`boolean`

True if the palette is empty, false otherwise.

**`See`**

[Palette.size](Palette.md#size)

#### Defined in

[palette.ts:115](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/palette.ts#L115)

___

### size

▸ **size**(): `number`

Return the number of swatches.

#### Returns

`number`

The number of swatches.

**`See`**

[Palette.isEmpty](Palette.md#isempty)

#### Defined in

[palette.ts:105](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/palette.ts#L105)

___

### extract

▸ **extract**(`source`, `options?`): [`Palette`](Palette.md)

Extract a color palette from the given image source.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | [`ImageSource`](../README.md#imagesource) | The source of the image. |
| `options` | `Partial`\<[`Options`](../interfaces/Options.md)\> | The options for palette extraction. |

#### Returns

[`Palette`](Palette.md)

A new Palette instance containing the extracted swatches.

#### Defined in

[palette.ts:210](https://github.com/t28hub/auto-palette-ts/blob/6bb2d1f/src/palette.ts#L210)
