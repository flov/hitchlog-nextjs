import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

function createOverlayElement() {
  const el = document.createElement('div');
  el.style.position = 'absolute';
  el.style.display = 'inline-block';
  el.style.width = '9999px';
  return el;
}

export type Props = {
  map: any;
  position: { lat: number; lng: number };
  children?: React.ReactNode;
};

const OverlayContainer = (props: Props) => {
  const overlay = useRef<google.maps.OverlayView | null>(null);
  const el = useRef<Element | null>(null);

  class OverlayView extends window.google.maps.OverlayView {
    position: google.maps.LatLng;
    content: HTMLDivElement;

    constructor(props: any) {
      super();
      this.position = props.position;
      this.content = props.content;
    }

    onAdd = () => {
      if (this.content) this.getPanes()!.floatPane.appendChild(this.content);
    };

    onRemove = () => {
      if (this.content?.parentElement) {
        this.content.parentElement.removeChild(this.content);
      }
    };

    draw = () => {
      const divPosition = this.getProjection().fromLatLngToDivPixel(
        this.position
      )!;

      // Hide the popup when it is far out of view.
      const display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
          ? 'block'
          : 'none';

      if (display === 'block') {
        this.content.style.left = divPosition.x + 'px';
        this.content.style.top = divPosition.y + 'px';
      }

      if (this.content.style.display !== display) {
        this.content.style.display = display;
      }
    };
  }

  useEffect(() => {
    return () => {
      if (overlay.current) {
        overlay.current.setMap(null);
      }
    };
  }, []);

  if (props.map) {
    el.current = el.current || createOverlayElement();
    overlay.current = new OverlayView({
      position: new google.maps.LatLng(props.position.lat, props.position.lng),
      content: el.current,
    });
    overlay.current.setMap(props.map);
    return ReactDOM.createPortal(props.children, el.current);
  }
  return null;
};

export default OverlayContainer;
