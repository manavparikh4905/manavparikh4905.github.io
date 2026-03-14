# Manav Parikh — Portfolio v2.0
## Asset Management Guide

Drop your media files into the folders below and deploy. The site will
automatically use them — no code changes needed.

---

## 📁 Folder Structure

```
portfolio/
├── index.html
├── about.html
├── projects.html
├── skills.html
├── achievements.html
├── gallery.html
├── contact.html
├── notes.html
├── sys-diff-drive.html
├── sys-swerve.html
├── sys-ros-nav.html
├── sys-mech.html
├── topic-*.html
├── style.css
├── theme.js
└── assets/
    ├── images/
    │   ├── profile.jpg              ← Your photo (About page avatar)
    │   ├── competition/
    │   │   ├── robocon_2024.jpg     ← Achievements page — 2024 photo
    │   │   └── robocon_2025.jpg     ← Achievements page — 2025 photo
    │   ├── cad/
    │   │   ├── chassis_render.jpg   ← index.html Project 04 media
    │   │   ├── hero_render.jpg      ← sys-mech.html hero image
    │   │   ├── cad_full_assembly.jpg
    │   │   ├── cad_drivetrain.jpg
    │   │   ├── cad_chassis.jpg
    │   │   ├── cad_swerve_module.jpg
    │   │   ├── cad_exploded.jpg
    │   │   ├── swerve_cad_01.jpg    ← sys-swerve.html gallery
    │   │   └── mech_design_render.jpg ← projects.html Project 04
    │   ├── hardware/
    │   │   ├── swerve_module_01.jpg ← sys-swerve.html gallery
    │   │   ├── swerve_full_01.jpg
    │   │   ├── diff_drive_robot.jpg ← sys-diff-drive.html gallery
    │   │   ├── hardware_chassis.jpg ← sys-mech.html gallery
    │   │   ├── hardware_drivetrain.jpg
    │   │   └── hardware_full_robot.jpg
    │   ├── gallery/                 ← gallery.html masonry grid
    │   │   ├── competition_01.jpg
    │   │   ├── competition_02.jpg
    │   │   ├── competition_03.jpg
    │   │   ├── hardware_01.jpg
    │   │   ├── hardware_02.jpg
    │   │   ├── hardware_03.jpg
    │   │   ├── cad_01.jpg
    │   │   ├── cad_02.jpg
    │   │   ├── cad_03.jpg
    │   │   ├── testing_01.jpg
    │   │   ├── testing_02.jpg
    │   │   └── testing_03.jpg
    │   └── testing/
    │       ├── hybrid_astar_rviz.jpg  ← sys-diff-drive.html gallery
    │       ├── costmap_view.jpg
    │       ├── slam_map.jpg           ← sys-ros-nav.html gallery
    │       ├── amcl_particles.jpg
    │       └── field_test.jpg
    └── videos/
        ├── hero_background.mp4      ← index.html full-screen hero BG
        ├── ros_nav_demo.mp4         ← ROS2 nav system demo
        ├── hybrid_astar_demo.mp4    ← Diff drive path planner demo
        ├── swerve_demo.mp4          ← 3WD swerve demo
        └── cad_walkthrough.mp4      ← SolidWorks assembly walkthrough
```

---

## 🎥 Video Tips

- **Hero background** (`hero_background.mp4`): Any cinematic robot footage works.
  Muted, looping, ideally 10–30 seconds. The site dims and desaturates it automatically.
- **Demo videos**: Use screen-recorded RViz sessions, actual robot footage, or
  CAD animations. MP4 / H.264 recommended for browser compatibility.
- **File size**: Compress videos to < 15 MB each using HandBrake or ffmpeg:
  ```
  ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -acodec aac output.mp4
  ```

## 🖼️ Image Tips

- **Format**: JPG for photos/renders, PNG only if transparency needed.
- **Resolution**: 1200–2000px wide. The site handles scaling.
- **Profile photo**: Square crop recommended, min 400×400px.

## 🚀 Deployment

This is a pure static site — no build step needed.
Just drag the whole `portfolio/` folder to:
- **GitHub Pages**: push to `gh-pages` branch, enable in repo Settings
- **Netlify**: drag folder to netlify.com/drop
- **Vercel**: `npx vercel` in the folder

---

© 2026 Manav Parikh
