/**
 * MandirOS embed widget
 * Usage:
 * <div id="mandiros-donate"></div>
 * <script src="https://your-domain/widget.js" data-temple="jamsawli-hanuman" data-type="donate" data-target="mandiros-donate"></script>
 */
(function () {
  var script = document.currentScript;
  if (!script) return;

  var temple = script.getAttribute("data-temple") || "jamsawli-hanuman";
  var type = script.getAttribute("data-type") || "donate";
  var targetId = script.getAttribute("data-target");
  var height = script.getAttribute("data-height") || (type === "book" ? "720" : "780");
  var base =
    script.getAttribute("data-base") ||
    (script.src ? script.src.replace(/\/widget\.js.*$/, "") : "");

  var path = type === "book" ? "/embed/book" : "/embed/donate";
  var src = base + path + "?temple=" + encodeURIComponent(temple);

  var iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.title = "MandirOS " + type;
  iframe.style.width = "100%";
  iframe.style.maxWidth = "480px";
  iframe.style.height = height + "px";
  iframe.style.border = "0";
  iframe.style.borderRadius = "12px";
  iframe.setAttribute("loading", "lazy");
  iframe.setAttribute("allow", "payment *");

  var mount = targetId ? document.getElementById(targetId) : null;
  if (mount) {
    mount.appendChild(iframe);
  } else {
    script.parentNode.insertBefore(iframe, script);
  }
})();
