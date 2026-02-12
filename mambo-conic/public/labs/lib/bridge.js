// Lab Bridge - 实验与主框架的通信协议
const LabBridge = {
  // 实验加载完成，通知主框架
  ready: function() {
    window.parent.postMessage({ type: 'LAB_READY' }, '*');
  },

  // 实验完成，传递结果
  result: function(data) {
    window.parent.postMessage({ type: 'LAB_RESULT', payload: data }, '*');
  }
};
