# RoboAware: Learning to Coordinate Embodied Skills from Counterfactual Outcomes

[[Website]](https://zhoubohan0.github.io/RoboAware/) [[arXiv]](https://arxiv.org/abs/2610.11480)

RoboAware coordinates modular robot skills and frozen end-to-end policies by learning a state-conditioned responsibility coordinator from counterfactual outcomes. The coding agent and executor interfaces remain fixed.

- **P⁵ skill schema:** organizes skills into five semantic stages at which policy-family responsibility can be compared.
- **State-Locked Counterfactual Branching:** executes admissible policy families from the same restored training state to observe alternative outcomes.
- **Execution-Aware Learning:** combines Monte Carlo tree search and Q-learning to learn family-conditioned values for deployment-time coordination.

Single-episode evaluations on 100 tasks achieve a 77.0% overall success rate, with averages of 90.0% on RoboSuite, 73.8% on LIBERO-Pro task clusters, and 90.0% on RoboTwin bimanual tasks. See the [paper](https://arxiv.org/abs/2610.11480) for the evaluation protocol and comparisons.

## Video demonstrations

The [website](https://zhoubohan0.github.io/RoboAware/) presents **24 recordings across 7 experiments**: policy-family coordination, microwave-door closing, and four tasks across Franka Panda, UR5 + WSG, ARX X5, and Aloha AgileX.

Videos load on demand and are muted by default. Each comparison supports individual playback, Play together, Restart, and playback-speed selection. Cross-embodiment clips default to 0.25× playback. Starting clips together does not imply matched physical time, source speed, or simulator states; the videos are qualitative demonstrations, not execution-time measurements.

## Citation

If you find this work useful, please consider citing:

```bibtex
@article{zhou2026roboaware,
  title={RoboAware: Learning to Coordinate Embodied Skills from Counterfactual Outcomes},
  author={Zhou, Bohan and Chen, Xingbei and Huang, Emily and Ruan, Weilin and Huang, Haojian and Zhang, Yehang and Li, Zexi and Li, Wenqian and Yu, Qize and Song, Zetian and Wu, Leyi and Li, Jinghao and Song, Mingxuan and Xu, Xinrun and Qiu, Zongyang and Wei, Yangkai and Zhang, Tianyi and Zhou, Kaiwen and Li, Yinchuan and Cheng, James},
  journal={arXiv preprint arXiv:2610.11480},
  year={2026},
  url={https://arxiv.org/abs/2610.11480}
}
```

## Local preview

This repository contains the public project website. It uses static HTML, CSS, JavaScript, and local media assets, with no build step or package installation.

Run from this repository's root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory docs
```

Open [http://127.0.0.1:8765/](http://127.0.0.1:8765/).

- `docs/index.html`: project introduction and abstract.
- `docs/gallery-data.js`: experiments, labels, video paths, and default playback rates.
- `docs/gallery.js`: gallery rendering and playback controls.
- `docs/styles.css`: layout and responsive presentation.
- `docs/assets/`: the displayed videos, posters, and project mark.

## Deployment and maintenance

GitHub Pages publishes the `docs/` directory on `main` at **https://zhoubohan0.github.io/RoboAware/**. In repository Settings → Pages, select **Deploy from a branch**, branch **main**, and folder **/docs**. `docs/.nojekyll` keeps the static files unchanged. Pushing website changes to `main` triggers publication.

The parent `Project-RoboAware` repository includes this entire repository as its `website` Git submodule. The website has one maintained copy at `website/docs/`; the parent records the exact published repository commit.

For a fresh parent checkout (requires access to the parent repository):

```sh
git clone --recurse-submodules git@github.com:zhoubohan0/Project-RoboAware.git
cd Project-RoboAware
```

For an existing parent checkout:

```sh
git submodule update --init --recursive
```

To update the site, start from the parent repository root with a clean working tree:

```sh
cd website
git switch main
git pull --ff-only origin main
# Edit files under docs/ and preview them locally.
git add docs README.md .gitignore
git commit -m "Update RoboAware website"
git push origin main
cd ..
git add website
git commit -m "Update RoboAware website submodule"
git push
```

Publish the submodule commit before pushing the parent pointer. After pulling a parent update, run `git submodule update --init --recursive` to restore its recorded website version. HTTPS authentication or an SSH push URL is needed to push changes to the public website repository.
