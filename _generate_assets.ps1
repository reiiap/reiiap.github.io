$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$assets = 'd:\MyWebsite\assets'
New-Item -ItemType Directory -Force -Path $assets | Out-Null

function New-BadgePng {
  param(
    [string]$Path,
    [int]$Size,
    [string]$Text
  )

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
  $rectF = New-Object System.Drawing.RectangleF 0, 0, ([float]$Size), ([float]$Size)

  $baseBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 11, 18, 32))
  $g.FillRectangle($baseBrush, $rect)

  $overlay = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(140, 56, 189, 248)), ([System.Drawing.Color]::FromArgb(110, 250, 204, 21)), 45
  $g.FillRectangle($overlay, $rect)

  $borderWidth = [float]([math]::Max(2, [math]::Round($Size / 64.0)))
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(70, 148, 163, 184)), $borderWidth
  $g.DrawRectangle($pen, 1, 1, $Size - 3, $Size - 3)

  $fontSize = [float]([math]::Round($Size * 0.44))
  $font = New-Object System.Drawing.Font -ArgumentList @('Arial Black', $fontSize, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel))
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $brushText = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(245, 229, 231, 235))
  $g.DrawString($Text, $font, $brushText, $rectF, $sf)

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

function New-QrisPng {
  param([string]$Path)

  $size = 1024
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::FromArgb(255, 248, 250, 252))

  $pad = 90
  $qrSize = $size - ($pad * 2)
  $cell = [math]::Floor($qrSize / 33)
  $qrSize = $cell * 33
  $x0 = [int](($size - $qrSize) / 2)
  $y0 = $x0

  $blackBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
  $rand = New-Object System.Random 1337

  for ($y = 0; $y -lt 33; $y++) {
    for ($x = 0; $x -lt 33; $x++) {
      if ($rand.NextDouble() -lt 0.42) {
        $g.FillRectangle($blackBrush, $x0 + $x * $cell, $y0 + $y * $cell, $cell, $cell)
      }
    }
  }

  function DrawFinder {
    param([int]$Fx, [int]$Fy)

    $outer = 7 * $cell
    $inner = 5 * $cell
    $core = 3 * $cell
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 248, 250, 252))

    $g.FillRectangle($blackBrush, $Fx, $Fy, $outer, $outer)
    $g.FillRectangle($whiteBrush, $Fx + $cell, $Fy + $cell, $inner, $inner)
    $g.FillRectangle($blackBrush, $Fx + 2 * $cell, $Fy + 2 * $cell, $core, $core)
  }

  DrawFinder $x0 $y0
  DrawFinder ($x0 + ($qrSize - 7 * $cell)) $y0
  DrawFinder $x0 ($y0 + ($qrSize - 7 * $cell))

  $titleRect = New-Object System.Drawing.RectangleF 0, ([float]($size - 140)), ([float]$size), 120
  $font = New-Object System.Drawing.Font -ArgumentList @('Arial Black', 56, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel))
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString('QRIS', $font, $blackBrush, $titleRect, $sf)

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

function New-MinecraftBgPng {
  param([string]$Path)

  $size = 1024
  $tile = 64
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $rand = New-Object System.Random 2026
  $pal = @(
    [System.Drawing.Color]::FromArgb(255, 44, 84, 53),
    [System.Drawing.Color]::FromArgb(255, 73, 110, 63),
    [System.Drawing.Color]::FromArgb(255, 92, 59, 38),
    [System.Drawing.Color]::FromArgb(255, 120, 86, 57),
    [System.Drawing.Color]::FromArgb(255, 78, 86, 92),
    [System.Drawing.Color]::FromArgb(255, 108, 116, 122)
  )

  for ($y = 0; $y -lt $size; $y += $tile) {
    for ($x = 0; $x -lt $size; $x += $tile) {
      $c = $pal[$rand.Next(0, $pal.Count)]
      $brush = New-Object System.Drawing.SolidBrush $c
      $g.FillRectangle($brush, $x, $y, $tile, $tile)

      $shadeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(55, 0, 0, 0))
      $g.FillRectangle($shadeBrush, $x, $y, $tile, $tile)

      $edgePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(50, 0, 0, 0)), 1
      $g.DrawRectangle($edgePen, $x, $y, $tile, $tile)

      for ($i = 0; $i -lt 18; $i++) {
        $px = $x + $rand.Next(0, $tile)
        $py = $y + $rand.Next(0, $tile)
        $dotBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
        $g.FillRectangle($dotBrush, $px, $py, 2, 2)
      }
    }
  }

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

New-BadgePng -Path (Join-Path $assets 'logo.png') -Size 256 -Text 'RK'
New-BadgePng -Path (Join-Path $assets 'favicon.png') -Size 64 -Text 'RK'
New-QrisPng -Path (Join-Path $assets 'qris.png')
New-MinecraftBgPng -Path (Join-Path $assets 'minecraft-bg.png')

'OK'
