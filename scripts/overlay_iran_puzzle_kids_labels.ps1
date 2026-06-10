$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$gen = Join-Path $root 'assets\neli-world\puzzle\Iran\generated'
$fontPath = Join-Path $root 'node_modules\@expo-google-fonts\vazirmatn\Vazirmatn_800ExtraBold.ttf'
$labelsPath = Join-Path $gen 'iran_kids_labels.json'

$privateFonts = New-Object System.Drawing.Text.PrivateFontCollection
$privateFonts.AddFontFile($fontPath)
$fontFamily = $privateFonts.Families[0]

function Save-Png($bitmap, [string] $path) {
  $tmp = "$path.$([System.Guid]::NewGuid().ToString('N')).tmp.png"
  $stream = [System.IO.File]::Open($tmp, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write)
  try {
    $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $stream.Dispose()
  }
  Copy-Item -LiteralPath $tmp -Destination $path -Force
}

function Load-BitmapNoLock([string] $path) {
  $stream = [System.IO.File]::Open($path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
  try {
    $loaded = [System.Drawing.Image]::FromStream($stream)
    try {
      return New-Object System.Drawing.Bitmap($loaded)
    } finally {
      $loaded.Dispose()
    }
  } finally {
    $stream.Dispose()
  }
}

function New-LabelFormat {
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $format.FormatFlags = $format.FormatFlags -bor [System.Drawing.StringFormatFlags]::DirectionRightToLeft
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  return $format
}

function Get-PieceFontSize($width, $height, [string] $name) {
  $minSide = [Math]::Min($width, $height)
  $size = [Math]::Max(17, [Math]::Min(44, $minSide * 0.22))
  if ($name.Length -gt 14) {
    $size = $size * 0.72
  } elseif ($name.Length -gt 9) {
    $size = $size * 0.82
  }
  return [Math]::Max(13, $size)
}

function Get-BaseFontSize($boxWidth, $boxHeight, [string] $name) {
  $minSide = [Math]::Min($boxWidth, $boxHeight)
  $size = [Math]::Max(22, [Math]::Min(60, $minSide * 0.15))
  if ($name.Length -gt 14) {
    $size = $size * 0.52
  } elseif ($name.Length -gt 9) {
    $size = $size * 0.66
  }
  return [Math]::Max(17, $size)
}

$labels = Get-Content -LiteralPath $labelsPath -Encoding UTF8 | ConvertFrom-Json
$format = New-LabelFormat
$textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 28, 32, 36))

foreach ($label in $labels) {
  $bitmap = Load-BitmapNoLock $label.piecePath
  $pieceOutPath = $label.piecePath -replace 'province_kids_', 'province_kids_labeled_'
  try {
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
      $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
      $fontSize = Get-PieceFontSize $bitmap.Width $bitmap.Height $label.nameFa
      $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
      try {
        [float] $padX = [Math]::Max(8.0, [double]$bitmap.Width * 0.10)
        [float] $padY = [Math]::Max(8.0, [double]$bitmap.Height * 0.12)
        $rect = [System.Drawing.RectangleF]::new($padX, $padY, [float]([double]$bitmap.Width - [double]$padX * 2.0), [float]([double]$bitmap.Height - [double]$padY * 2.0))
        $graphics.DrawString($label.nameFa, $font, $textBrush, $rect, $format)
      } finally {
        $font.Dispose()
      }
    } finally {
      $graphics.Dispose()
    }
    Save-Png $bitmap $pieceOutPath
  } finally {
    $bitmap.Dispose()
  }
}

$basePath = Join-Path $gen 'iran_kids_placeholder_3840x2160_base.png'
$baseOut = Join-Path $gen 'iran_kids_placeholder_3840x2160_labeled.png'
$croppedOut = Join-Path $gen 'iran_kids_placeholder_cropped_labeled.png'
$base = Load-BitmapNoLock $basePath
try {
  $graphics = [System.Drawing.Graphics]::FromImage($base)
  try {
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    foreach ($label in $labels) {
      $box = $label.sourceBox
      $boxWidth = [double]($box[2] - $box[0])
      $boxHeight = [double]($box[3] - $box[1])
      $fontSize = Get-BaseFontSize $boxWidth $boxHeight $label.nameFa
      $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
      try {
        [float] $padX = [Math]::Max(7.0, $boxWidth * 0.08)
        [float] $padY = [Math]::Max(6.0, $boxHeight * 0.08)
        $rect = [System.Drawing.RectangleF]::new(
          [float]([double]$box[0] + [double]$padX),
          [float]([double]$box[1] + [double]$padY),
          [float]($boxWidth - [double]$padX * 2.0),
          [float]($boxHeight - [double]$padY * 2.0)
        )
        $graphics.DrawString($label.nameFa, $font, $textBrush, $rect, $format)
      } finally {
        $font.Dispose()
      }
    }
  } finally {
    $graphics.Dispose()
  }
  Save-Png $base $baseOut

  $cropRect = New-Object System.Drawing.Rectangle(897, 40, 2063, 2042)
  $cropped = $base.Clone($cropRect, $base.PixelFormat)
  try {
    Save-Png $cropped $croppedOut
  } finally {
    $cropped.Dispose()
  }
} finally {
  $base.Dispose()
}

$format.Dispose()
$textBrush.Dispose()
$privateFonts.Dispose()
