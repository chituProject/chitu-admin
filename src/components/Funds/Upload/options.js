import * as XLSX from 'xlsx'

export const spuOptions = Object.freeze([
  'spu_id',
  'created_at',
  'updated_at',
  'title',
  'full_title',
  'description',
  'meta_specification',
  'merchant',
  'brand',
  'shipment_fee'
])
export const extraOptions = Object.freeze([
  'url'
])

export function parseFile (file) {
  var rABS = typeof FileReader !== 'undefined' && (FileReader.prototype || {}).readAsBinaryString

  function toJSON (workbook) {
    const result = {}
    workbook.SheetNames.forEach(sheetName => {
      const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
      if (roa.length) result[sheetName] = roa
    })
    return result
  }

  return new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.onload = function (e) {
      var data = e.target.result
      if (!rABS) data = new Uint8Array(data)
      var json = toJSON(XLSX.read(data, { type: rABS ? 'binary' : 'array' }))
      resolve(json)
    }
    reader.onerror = reject
    if (rABS) reader.readAsBinaryString(file)
    else reader.readAsArrayBuffer(file)
  })
}

export function modifiedEval (value, item) {
  const safe = ['number', 'boolean', 'null', 'undefined']
  const variable = safe.includes(typeof item) ? item : `"${item.toString()}"`
  try {
    // eslint-disable-next-line no-eval
    const val = eval(`(function(item){ ${value} })(${variable})`)
    return val
  } catch (e) {
    return item
  }
}
