param(
  [string]$FontPath,
  [string]$OutImageDir
)

Add-Type -AssemblyName System.Drawing

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (-not $FontPath) { $FontPath = 'C:\Windows\Fonts\tahomabd.ttf' }
if (-not $OutImageDir) { $OutImageDir = Join-Path $repoRoot 'assets/neli-world' }

$traceDir = Join-Path $OutImageDir 'trace-letters'
if (-not (Test-Path $traceDir)) {
  New-Item -ItemType Directory -Path $traceDir | Out-Null
}

$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile($FontPath)
$family = $pfc.Families[0]

$letters = @(
  @{ id = 'alef'; char = [char]0x0627; file = 'alef.png' },
  @{ id = 'be'; char = [char]0x0628; file = 'be.png' },
  @{ id = 'pe'; char = [char]0x067E; file = 'pe.png' },
  @{ id = 'te'; char = [char]0x062A; file = 'te.png' },
  @{ id = 'se'; char = [char]0x062B; file = 'se.png' },
  @{ id = 'jim'; char = [char]0x062C; file = 'jim.png' },
  @{ id = 'che'; char = [char]0x0686; file = 'che.png' },
  @{ id = 'he-jimi'; char = [char]0x062D; file = 'he-jimi.png' },
  @{ id = 'khe'; char = [char]0x062E; file = 'khe.png' },
  @{ id = 'dal'; char = [char]0x062F; file = 'dal.png' },
  @{ id = 'zal'; char = [char]0x0630; file = 'zal.png' },
  @{ id = 're'; char = [char]0x0631; file = 're.png' },
  @{ id = 'ze'; char = [char]0x0632; file = 'ze.png' },
  @{ id = 'zhe'; char = [char]0x0698; file = 'zhe.png' },
  @{ id = 'sin'; char = [char]0x0633; file = 'sin.png' },
  @{ id = 'shin'; char = [char]0x0634; file = 'shin.png' },
  @{ id = 'sad'; char = [char]0x0635; file = 'sad.png' },
  @{ id = 'zad'; char = [char]0x0636; file = 'zad.png' },
  @{ id = 'ta'; char = [char]0x0637; file = 'ta.png' },
  @{ id = 'za'; char = [char]0x0638; file = 'za.png' },
  @{ id = 'eyn'; char = [char]0x0639; file = 'eyn.png' },
  @{ id = 'gheyn'; char = [char]0x063A; file = 'gheyn.png' },
  @{ id = 'fe'; char = [char]0x0641; file = 'fe.png' },
  @{ id = 'ghaf'; char = [char]0x0642; file = 'ghaf.png' },
  @{ id = 'kaf'; char = [char]0x06A9; file = 'kaf.png' },
  @{ id = 'gaf'; char = [char]0x06AF; file = 'gaf.png' },
  @{ id = 'lam'; char = [char]0x0644; file = 'lam.png' },
  @{ id = 'mim'; char = [char]0x0645; file = 'mim.png' },
  @{ id = 'noon'; char = [char]0x0646; file = 'noon.png' },
  @{ id = 'vav'; char = [char]0x0648; file = 'vav.png' },
  @{ id = 'he'; char = [char]0x0647; file = 'he.png' },
  @{ id = 'ye'; char = [char]0x06CC; file = 'ye.png' }
)

foreach ($item in $letters) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.FormatFlags = [System.Drawing.StringFormatFlags]::DirectionRightToLeft
  $path.AddString($item.char, $family, [int][System.Drawing.FontStyle]::Bold, 240, (New-Object System.Drawing.PointF 0,0), $fmt)

  $bounds = $path.GetBounds()
  $margin = 34
  $matrix = New-Object System.Drawing.Drawing2D.Matrix
  $matrix.Translate([float](-$bounds.X + $margin), [float](-$bounds.Y + $margin))
  $path.Transform($matrix)

  $renderBounds = $path.GetBounds()
  $width = [int][math]::Ceiling($renderBounds.Width + ($margin * 2))
  $height = [int][math]::Ceiling($renderBounds.Height + ($margin * 2))

  $bmp = New-Object System.Drawing.Bitmap $width, $height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)
  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $g.FillPath($brush, $path)
  $brush.Dispose()
  $g.Dispose()

  $pngPath = Join-Path $traceDir $item.file
  $bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}
