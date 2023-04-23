// IIFE 
(async () => {

  // observer
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.classList && node.classList.contains("inlineTooltip")) {
            inject();
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true, });

  const simulateKeydown = (el, keyCode) => {
    const keyboardEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      keyCode,
    });
    return el.dispatchEvent(keyboardEvent);
  };

  const generate = () => {
    const headingList = [...document.querySelectorAll("h3[name], h4[name]")];

    return headingList
      .filter(
        (headingTag) =>
          !headingTag.classList.contains("graf--title") &&
          !headingTag.classList.contains("graf--subtitle")
      )
      .map((headingTag) => {
        let bullet;
        switch (headingTag.tagName.toLowerCase()) {
          case "h1":
          case "h2":
          case "h3":
            bullet = `·`;
            break;
          case "h4":
            bullet = `  ∘`;
            break;
        }

        return `${bullet} <a href="#${headingTag.getAttribute(
          "name"
        )}" title="${headingTag.textContent}">${headingTag.textContent}</a>`;
      });
  };

  const handleAddToCClick = (e) => {
    const container = document.querySelector(".is-selected");
    const tooltipToggleMenu = document.querySelector("[data-action=inline-menu]");
    tooltipToggleMenu.click();

    container.innerHTML = generate().join("<br/>");

    setTimeout(() => {
      simulateKeydown(container, 13);
    }, 0);
  };

  const prepareAddToTableOfContentButton = () => {
    const addEmbedButton = document.querySelector(".inlineTooltip-menu [title='Add an embed']");
    const addToCButton = addEmbedButton.cloneNode(true);

    const title = "Add a Table of Contents";
    addToCButton.setAttribute("title", title);
    addToCButton.setAttribute("aria-label", title);
    addToCButton.setAttribute("data-action", "table-of-contents-tooltip");
    addToCButton.setAttribute("data-action-value", "Generate a table of contents");
    addToCButton.setAttribute("data-default-value", "Table of contents");
    addToCButton.innerHTML = `<img class="svgIcon svgIcon--addDividerInline svgIcon--33px" src="${chrome.runtime.getURL("/images/icon.png")}" width="32" height="32" />`;
    addToCButton.addEventListener("click", handleAddToCClick);

    return addToCButton;
  };


  const inject = () => {
    const tooltipToggleMenu = document.querySelector("[data-action=inline-menu]");
    const tooltip = document.querySelector(".inlineTooltip");
    const tooltipMenu = document.querySelector(".inlineTooltip-menu");
    const addEmbedButton = document.querySelector(".inlineTooltip-menu [title='Add an embed']");

    if (!tooltip || !tooltipToggleMenu || !tooltipMenu || !addEmbedButton) {
      return;
    }

    console.log('injected tooltip');

    tooltip.style.width = "auto";

    const toCButton = document.querySelector("[data-action='table-of-contents-tooltip']");
    if (toCButton) {
      return;
    }

    tooltipMenu.appendChild(prepareAddToTableOfContentButton());
  };
})();