import usePage from '../hooks/usePage';
import { PRD_CSS } from '../styles/prd';

// Internal, printable PRD template: every cell and line is editable in the browser.
export default function PrdTemplate() {
  usePage({ title: 'PRD Template', path: null, social: false, robots: 'noindex', css: PRD_CSS });

  return (
    <main>
      <div className="bar">
        <button onClick={() => window.print()}>Print / Save as PDF</button>
      </div>
      <h1 contentEditable suppressContentEditableWarning>
        PRD: [Feature / Product name]
      </h1>
      <p className="hint">Click any cell or line to edit. Use Print to save as PDF.</p>

      <h2>1. Feature / Product Metadata</h2>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th style={{ width: '30%' }}>Field</th>
              <th>Details</th>
            </tr>
            <tr>
              <td>Feature / Product name</td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>Owner (PM)</td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>Design lead</td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>Engineering lead</td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>Status</td>
              <td contentEditable suppressContentEditableWarning>
                Draft / In review / Approved / In development / Shipped
              </td>
            </tr>
            <tr>
              <td>Target release</td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>Priority</td>
              <td contentEditable suppressContentEditableWarning>
                P0 / P1 / P2
              </td>
            </tr>
            <tr>
              <td>Links</td>
              <td contentEditable suppressContentEditableWarning>
                Figma, Jira/Linear epic, research, analytics dashboard
              </td>
            </tr>
            <tr>
              <td>Last updated</td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>2. Executive Summary</h2>
      <h3>2.1 Problem</h3>
      <ul>
        <li contentEditable suppressContentEditableWarning>
          <strong>Who is affected?</strong> <span className="ph">(user segment / persona)</span>
        </li>
        <li contentEditable suppressContentEditableWarning>
          <strong>What is the problem?</strong> <span className="ph">(1–3 sentences, in the user's terms)</span>
        </li>
        <li contentEditable suppressContentEditableWarning>
          <strong>Evidence:</strong> <span className="ph">(research, support tickets, data, quotes)</span>
        </li>
        <li contentEditable suppressContentEditableWarning>
          <strong>Impact of not solving it:</strong> <span className="ph">(user pain, business cost)</span>
        </li>
      </ul>
      <h3>2.2 Solution</h3>
      <ul>
        <li contentEditable suppressContentEditableWarning>
          <strong>Summary:</strong> <span className="ph">(what we are building, in 2–4 sentences)</span>
        </li>
        <li contentEditable suppressContentEditableWarning>
          <strong>Goals / success metrics:</strong> <span className="ph">(metric, baseline, target)</span>
        </li>
        <li contentEditable suppressContentEditableWarning>
          <strong>Key principles or constraints:</strong>{' '}
          <span className="ph">(technical, legal, brand, timeline)</span>
        </li>
      </ul>

      <h2>3. User Stories</h2>
      <p className="hint">As a [type of user], I want to [action], so that [benefit].</p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th style={{ width: '70%' }}>User story</th>
              <th>Priority</th>
            </tr>
            <tr>
              <td>US-1</td>
              <td contentEditable suppressContentEditableWarning>
                As a ..., I want to ..., so that ...
              </td>
              <td contentEditable suppressContentEditableWarning>
                Must
              </td>
            </tr>
            <tr>
              <td>US-2</td>
              <td contentEditable suppressContentEditableWarning>
                As a ..., I want to ..., so that ...
              </td>
              <td contentEditable suppressContentEditableWarning>
                Should
              </td>
            </tr>
            <tr>
              <td>US-3</td>
              <td contentEditable suppressContentEditableWarning>
                As a ..., I want to ..., so that ...
              </td>
              <td contentEditable suppressContentEditableWarning>
                Could
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>4. Functional Requirements</h2>
      <p className="hint">
        What the system must do. One testable behavior per line, e.g. "The system shall let a signed-in user add an item
        to a wishlist."
      </p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th style={{ width: '55%' }}>Requirement</th>
              <th>Related story</th>
              <th>Priority</th>
            </tr>
            <tr>
              <td>FR-1</td>
              <td contentEditable suppressContentEditableWarning>
                The system shall ...
              </td>
              <td contentEditable suppressContentEditableWarning>
                US-1
              </td>
              <td contentEditable suppressContentEditableWarning>
                Must
              </td>
            </tr>
            <tr>
              <td>FR-2</td>
              <td contentEditable suppressContentEditableWarning>
                The system shall ...
              </td>
              <td contentEditable suppressContentEditableWarning>
                US-2
              </td>
              <td contentEditable suppressContentEditableWarning>
                Should
              </td>
            </tr>
            <tr>
              <td>FR-3</td>
              <td contentEditable suppressContentEditableWarning>
                The system shall ...
              </td>
              <td contentEditable suppressContentEditableWarning>
                US-3
              </td>
              <td contentEditable suppressContentEditableWarning>
                Could
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>5. Screens</h2>
      <p className="hint">
        List every screen or state, with a link to the design. Include empty, loading, error and success states.
      </p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>#</th>
              <th>Screen / state</th>
              <th>Description</th>
              <th>Design link</th>
            </tr>
            <tr>
              <td>S1</td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>S2</td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>6. Flow Map</h2>
      <p className="hint">Describe or link the end-to-end user flow (diagram, FigJam or Figma).</p>
      <div className="flow" contentEditable suppressContentEditableWarning>
        Paste flow diagram or link here
      </div>
      <ol>
        <li contentEditable suppressContentEditableWarning>
          Entry point: ...
        </li>
        <li contentEditable suppressContentEditableWarning>
          Step 1 → Screen S1: ...
        </li>
        <li contentEditable suppressContentEditableWarning>
          Step 2 → Screen S2: ...
        </li>
        <li contentEditable suppressContentEditableWarning>
          Exit / success state: ...
        </li>
      </ol>
      <p className="hint" contentEditable suppressContentEditableWarning>
        Decision points: (If X → go to Y, otherwise → Z)
      </p>

      <h2>7. Acceptance Criteria</h2>
      <p className="hint">Given [context], when [action], then [expected result].</p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Related story</th>
              <th style={{ width: '60%' }}>Criteria</th>
              <th>Pass?</th>
            </tr>
            <tr>
              <td>AC-1</td>
              <td contentEditable suppressContentEditableWarning>
                US-1
              </td>
              <td contentEditable suppressContentEditableWarning>
                Given ..., when ..., then ...
              </td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>AC-2</td>
              <td contentEditable suppressContentEditableWarning>
                US-2
              </td>
              <td contentEditable suppressContentEditableWarning>
                Given ..., when ..., then ...
              </td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>8. Edge Cases (Errors)</h2>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Scenario</th>
              <th>Expected behavior</th>
              <th>Error message / UX</th>
            </tr>
            <tr>
              <td>E-1</td>
              <td contentEditable suppressContentEditableWarning>
                No network / request timeout
              </td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>E-2</td>
              <td contentEditable suppressContentEditableWarning>
                Invalid or missing input
              </td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>E-3</td>
              <td contentEditable suppressContentEditableWarning>
                Permission denied / session expired
              </td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>E-4</td>
              <td contentEditable suppressContentEditableWarning>
                Empty data / first-time user
              </td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>E-5</td>
              <td contentEditable suppressContentEditableWarning>
                Unexpected server error
              </td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>9. Out of Scope</h2>
      <p>Explicitly not part of this release:</p>
      <ul>
        <li contentEditable suppressContentEditableWarning>
          ...
        </li>
        <li contentEditable suppressContentEditableWarning>
          ...
        </li>
      </ul>
      <p className="hint" contentEditable suppressContentEditableWarning>
        Future considerations: (items deferred to a later phase)
      </p>

      <h2>10. Questions &amp; Blockers</h2>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>#</th>
              <th>Question / blocker</th>
              <th>Type</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Resolution</th>
            </tr>
            <tr>
              <td>Q1</td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning>
                Question / Blocker
              </td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning>
                Open
              </td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>Q2</td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning>
                Question / Blocker
              </td>
              <td contentEditable suppressContentEditableWarning></td>
              <td contentEditable suppressContentEditableWarning>
                Open
              </td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
