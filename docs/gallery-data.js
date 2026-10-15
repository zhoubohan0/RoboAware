/* Paths retain the original directory structure under assets/. */
const hybridRoot = 'assets/ablation-hybrid/videos-cropped';
const robotRoot = 'assets/ablation-cross-embodied';
const policyVideos = (task, modularFile, modularOutcome) => [
  { label: 'End-to-end only', detail: 'RoboAware-EO', src: `${hybridRoot}/${task}/01_pure_vla_failure.mp4`, outcome: 'Task not completed', result: 'failure' },
  { label: 'Modular only', detail: 'RoboAware-MO', src: `${hybridRoot}/${task}/${modularFile}.mp4`, outcome: modularOutcome, result: 'failure' },
  { label: 'RoboAware', detail: 'Ours · coordinated execution', src: `${hybridRoot}/${task}/03_hybrid_success.mp4`, outcome: 'Task completed', result: 'success', ours: true },
];
const robotVideos = task => [
  ['Franka Panda', 'franka_panda'], ['UR5 + WSG', 'ur5_wsg'], ['ARX X5', 'arx_x5'], ['Aloha AgileX', 'aloha_agilex'],
].map(([label, file]) => ({ label, detail: 'RoboAware', src: `${robotRoot}/${task}/${file}.mp4` }));

const experimentGroups = [
  { id: 'coordination', number: '01', label: 'POLICY COORDINATION', title: 'Two policy families. One coordinated execution.', description: 'Modular-only and end-to-end-only variants fail at different stages. RoboAware selects the policy family at P⁵ skill boundaries, combining their capabilities within a task.' },
  { id: 'contact', number: '02', label: 'CONTACT-RICH CONTROL', title: 'The final interaction matters.', description: 'The microwave task tests precise contact with an articulated object. These clips compare the door-closing interaction for Cap-X and RoboAware.' },
  { id: 'embodiments', number: '03', label: 'ACROSS ROBOT EMBODIMENTS', title: 'Different robots. A shared skill interface.', description: 'Four tasks shown across Franka Panda, UR5 + WSG, ARX X5, and Aloha AgileX. These short qualitative demonstrations illustrate execution across robot embodiments.' },
];

const experiments = [
  { id: 'spatial-bowl', group: 'coordination', title: 'Pick the akita black bowl between the plate and the ramekin and place it on the plate.', tag: 'LIBERO-Pro · Spat-S_00', caption: 'Under a spatial perturbation, neither policy family alone completes this example. Coordinated execution reaches the target plate.', videos: policyVideos('spats00', '02_pure_non_vla_failure', 'Task not completed') },
  { id: 'salad-dressing', group: 'coordination', title: 'Pick the salad dressing and place it in the basket.', tag: 'LIBERO-Pro · Obj-S_02', caption: 'The modular-only grasp slips; the end-to-end-only rollout also fails. RoboAware combines the two families to complete the placement.', videos: policyVideos('objs02', '02_pure_non_vla_grasp_slip_failure', 'Grasp slips') },
  { id: 'microwave', group: 'contact', title: 'Close the microwave door.', tag: 'LIBERO-Pro · Microwave task', caption: 'A close-up comparison of the door-closing outcome. The manuscript discusses this interaction in its contact-rich task comparison.', videos: [
    { label: 'Cap-X', detail: 'Code-as-policy baseline', src: 'assets/ablation-hard/microwave-task/02_failure_door_not_closed.mp4', outcome: 'Door remains open', result: 'failure' },
    { label: 'RoboAware', detail: 'Ours · coordinated execution', src: 'assets/ablation-hard/microwave-task/01_success.mp4', outcome: 'Door closed', result: 'success', ours: true },
  ] },
  { id: 'cans', group: 'embodiments', title: 'Place the cans into the plastic box.', tag: 'Cross-embodiment demonstration', speed: 0.25, videos: robotVideos('place_cans_plasticbox') },
  { id: 'bread', group: 'embodiments', title: 'Place the bread into the basket.', tag: 'Cross-embodiment demonstration', speed: 0.25, videos: robotVideos('place_bread_basket') },
  { id: 'stack', group: 'embodiments', title: 'Stack two blocks.', tag: 'Cross-embodiment demonstration', speed: 0.25, videos: robotVideos('stack_blocks_two') },
  { id: 'ranking', group: 'embodiments', title: 'Arrange the red, green, and blue blocks.', tag: 'Cross-embodiment demonstration', speed: 0.25, videos: robotVideos('blocks_ranking_rgb') },
];
