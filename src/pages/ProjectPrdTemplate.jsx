import { memo, useRef } from 'react';
import usePage from '../hooks/usePage';
import { PROJECT_PRD_CSS } from '../styles/prd';

/*
  Internal, printable project-requirements template. The whole page is a contentEditable document,
  so after the first render React deliberately leaves its contents alone: the document never
  re-renders, and the toolbar actions below edit the live document through refs. That keeps
  whatever someone has typed intact when rows are added or placeholders are cleared.
*/
function ProjectPrdTemplate() {
  usePage({
    title: 'Project Requirements Template',
    path: null,
    social: false,
    robots: 'noindex',
    css: PROJECT_PRD_CSS,
  });

  const rootRef = useRef(null);
  const featuresRef = useRef(null);
  const ganttRef = useRef(null);

  // Feature index: add a row with the next ID
  const addRow = () => {
    const t = featuresRef.current;
    const r = t.insertRow(-1);
    ['F-' + String(t.rows.length - 1).padStart(2, '0'), 'Feature name', '', '', '', 'Draft', 'https://...'].forEach(
      (v) => {
        const c = r.insertCell(-1);
        c.contentEditable = 'true';
        c.textContent = v;
      }
    );
  };

  // Timeline: click toggles shading, double-click toggles a milestone
  const toggleCell = (e) => {
    const c = e.target.closest('td.gt');
    if (c && !c.classList.contains('ms')) c.classList.toggle('on');
  };
  const toggleMilestone = (e) => {
    const c = e.target.closest('td.gt');
    if (!c) return;
    c.classList.remove('on');
    const has = c.classList.toggle('ms');
    c.textContent = has ? '\u25C6' : '';
  };
  const addGanttRow = () => {
    const t = ganttRef.current;
    const cols = t.rows[0].cells.length;
    const r = t.insertRow(-1);
    const l = r.insertCell(-1);
    l.className = 'lbl';
    l.contentEditable = 'true';
    l.textContent = 'New workstream';
    for (let i = 1; i < cols; i++) r.insertCell(-1).className = 'gt';
  };

  // Remove every example filler and the shaded example timeline
  const clearExamples = () => {
    if (!window.confirm('Clear placeholder text and timeline shading? This cannot be undone.')) return;
    const root = rootRef.current;
    root.querySelectorAll('span.ex').forEach((el) => el.remove());
    root.querySelectorAll('td.ex, li.ex, th.ex').forEach((el) => {
      el.textContent = '';
      el.classList.remove('ex');
    });
    root.querySelectorAll('td.gt').forEach((el) => {
      el.classList.remove('on', 'ms');
      el.textContent = '';
    });
  };

  return (
    <main ref={rootRef}>
      <div className="bar">
        <button onClick={clearExamples}>Clear placeholder text</button>
        <button onClick={() => window.print()}>Print / Save as PDF</button>
      </div>
      <h1 contentEditable suppressContentEditableWarning>
        Project Requirements: <span className="ex">[Project name]</span>
      </h1>
      <p className="hint">
        Master document for the whole project. Shared decisions live here; feature detail lives in each feature PRD,
        linked from section 6. Each section starts with a short note on what it covers. Grey text is placeholder
        guidance: overwrite it, or use "Clear placeholder text". Click any cell or line to edit.
      </p>

      <nav className="toc">
        <strong>Contents</strong>
        <ol>
          <li>
            <a href="#s1">Document control</a>
          </li>
          <li>
            <a href="#s2">Vision &amp; background</a>
          </li>
          <li>
            <a href="#s3">Goals, non-goals &amp; success metrics</a>
          </li>
          <li>
            <a href="#s4">Users &amp; personas</a>
          </li>
          <li>
            <a href="#s5">Scope</a>
          </li>
          <li>
            <a href="#s6">Feature index</a>
          </li>
          <li>
            <a href="#s7">End-to-end user journeys</a>
          </li>
          <li>
            <a href="#s8">Project-wide requirements</a>
          </li>
          <li>
            <a href="#s9">Release plan &amp; milestones</a>
          </li>
          <li>
            <a href="#s10">Roadmap &amp; timeline</a>
          </li>
          <li>
            <a href="#s11">Dependencies &amp; risks</a>
          </li>
          <li>
            <a href="#s12">Open questions &amp; decisions log</a>
          </li>
          <li>
            <a href="#s13">Glossary</a>
          </li>
          <li>
            <a href="#s14">Revision history</a>
          </li>
        </ol>
      </nav>

      <h2 id="s1">1. Document Control</h2>
      <p className="purpose">
        <b>What this is:</b> who owns the document, what state it is in, and where related material lives. Anyone
        landing here should know in 10 seconds if it is current and who to ask.
      </p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th style={{ width: '30%' }}>Field</th>
              <th>Details</th>
            </tr>
            <tr>
              <td>Project name</td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>Owner (PM / Product lead)</td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>Status</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Draft / In review / Approved / In delivery / Launched
              </td>
            </tr>
            <tr>
              <td>Version</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                v0.1
              </td>
            </tr>
            <tr>
              <td>Approvers</td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>Target launch</td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>Links</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Figma, repo, roadmap, analytics dashboard, research
              </td>
            </tr>
            <tr>
              <td>Last updated</td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="s2">2. Vision &amp; Background</h2>
      <p className="purpose">
        <b>What this is:</b> the "why". The product-level problem and the future you are building toward, so every
        feature can be judged against it.
      </p>
      <ul>
        <li contentEditable suppressContentEditableWarning>
          <strong>Vision:</strong> <span className="ex">(1–2 sentences: what the product will be and for whom)</span>
        </li>
        <li contentEditable suppressContentEditableWarning>
          <strong>Problem / opportunity:</strong>{' '}
          <span className="ex">(the product-level problem, in users' terms)</span>
        </li>
        <li contentEditable suppressContentEditableWarning>
          <strong>Evidence:</strong> <span className="ex">(research, data, support tickets, quotes)</span>
        </li>
        <li contentEditable suppressContentEditableWarning>
          <strong>Context:</strong> <span className="ex">(market, competitors, prior work, why now)</span>
        </li>
      </ul>

      <h2 id="s3">3. Goals, Non-goals &amp; Success Metrics</h2>
      <p className="purpose">
        <b>What this is:</b> what success looks like, in numbers, and what you are choosing <i>not</i> to chase.
        Non-goals stop scope creep; metrics are how you will know it worked.
      </p>
      <h3>Goals</h3>
      <ul>
        <li contentEditable suppressContentEditableWarning>
          <span className="ex">Business: grow repeat orders by 20% within 6 months of launch.</span>
        </li>
        <li contentEditable suppressContentEditableWarning>
          <span className="ex">User: reorder a usual basket in under 60 seconds.</span>
        </li>
      </ul>
      <h3>Non-goals</h3>
      <p className="hint">
        Things we are deliberately not optimizing for. Different from out of scope: non-goals are priorities, out of
        scope is excluded work.
      </p>
      <ul>
        <li contentEditable suppressContentEditableWarning>
          <span className="ex">Not optimizing for first-time discovery of new products.</span>
        </li>
        <li contentEditable suppressContentEditableWarning>
          <span className="ex">Not replacing the web store in this release.</span>
        </li>
      </ul>
      <h3>Success metrics</h3>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>Metric</th>
              <th>Baseline</th>
              <th>Target</th>
              <th>How measured</th>
              <th>Review date</th>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="s4">4. Users &amp; Personas</h2>
      <p className="purpose">
        <b>What this is:</b> who the product is for, what they are trying to get done, and what gets in their way.
        Features should trace back to a persona.
      </p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>Persona</th>
              <th>Description</th>
              <th>Main jobs to be done</th>
              <th>Pain points</th>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="hint" contentEditable suppressContentEditableWarning>
        Not for: <span className="ex">(users this product is not designed for)</span>
      </p>

      <h2 id="s5">5. Scope</h2>
      <p className="purpose">
        <b>What this is:</b> the boundary of the project: what is included, what is not, and what you are assuming to be
        true.
      </p>
      <h3>In scope</h3>
      <ul>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
      </ul>
      <h3>Out of scope</h3>
      <ul>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
      </ul>
      <h3>Assumptions &amp; constraints</h3>
      <ul>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
      </ul>

      <h2 id="s6">6. Feature Index</h2>
      <p className="purpose">
        <b>What this is:</b> the master list of features, each linking to its own PRD. This is how the project doc and
        feature docs stay connected. Use stable IDs (F-01…) and number requirements F-01-FR-1 so references never clash.
        Update status as it changes.
      </p>
      <div className="table-wrap">
        <table id="features" ref={featuresRef}>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Feature</th>
              <th>Phase</th>
              <th>Priority</th>
              <th>Owner</th>
              <th>Status</th>
              <th>PRD link</th>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex">
                F-01
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                MVP
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex">
                F-02
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                MVP
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex">
                F-03
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                v1
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Draft
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex">
                F-04
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                v1
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Draft
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="small" onClick={addRow}>
        + Add feature row
      </button>

      <h2 id="s7">7. End-to-End User Journeys</h2>
      <p className="purpose">
        <b>What this is:</b> the main paths a user takes across several features. It shows how features fit together,
        which individual feature PRDs cannot.
      </p>
      <div className="flow" contentEditable suppressContentEditableWarning>
        Paste journey diagram or link here
      </div>
      <ol>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
      </ol>

      <h2 id="s8">8. Project-wide Requirements</h2>
      <p className="purpose">
        <b>What this is:</b> rules that apply to <i>every</i> feature. Write them once here; feature PRDs link back
        instead of repeating them. Non-functional requirements say <i>how well</i> the product must work (speed,
        security, accessibility), not what it does.
      </p>
      <h3>Non-functional requirements</h3>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th style={{ width: '40%' }}>Requirement</th>
              <th>Target</th>
            </tr>
            <tr>
              <td>NFR-1</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Performance
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>NFR-2</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Security
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>NFR-3</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Privacy / compliance
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>NFR-4</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Accessibility
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>NFR-5</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Compatibility
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>NFR-6</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Localization
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>NFR-7</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Reliability
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>Design &amp; UX principles</h3>
      <ul>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
      </ul>
      <h3>Technical constraints &amp; architecture notes</h3>
      <ul>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
      </ul>
      <h3>Analytics &amp; tracking standards</h3>
      <ul>
        <li contentEditable suppressContentEditableWarning className="ex">
          [Add item]
        </li>
      </ul>

      <h2 id="s9">9. Release Plan &amp; Milestones</h2>
      <p className="purpose">
        <b>What this is:</b> how the work is split into releases, what ships in each, and how you decide a release is
        "done". Use the Roadmap below for the visual timeline.
      </p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>Phase</th>
              <th>Scope (feature IDs)</th>
              <th>Target date</th>
              <th>Exit criteria</th>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex">
                v2
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="hint" contentEditable suppressContentEditableWarning>
        Rollout &amp; rollback: <span className="ex">(feature flags, % rollout, beta group, how to roll back)</span>
      </p>

      <h2 id="s10">10. Roadmap &amp; Timeline</h2>
      <p className="purpose">
        <b>What this is:</b> the high-level picture over time. The Now / Next / Later board shows priorities without
        hard dates; the timeline shows when work happens. Click any timeline cell to shade it, and click again to clear.
        Double-click a cell to mark a milestone (◆).
      </p>
      <h3>Roadmap: Now / Next / Later</h3>
      <div className="nnl">
        <div>
          <h4>Now (in build)</h4>
          <ul>
            <li contentEditable suppressContentEditableWarning className="ex">
              [Add item]
            </li>
            <li contentEditable suppressContentEditableWarning className="ex">
              [Add item]
            </li>
          </ul>
        </div>
        <div>
          <h4>Next (planned, scoped)</h4>
          <ul>
            <li contentEditable suppressContentEditableWarning className="ex">
              [Add item]
            </li>
            <li contentEditable suppressContentEditableWarning className="ex">
              [Add item]
            </li>
          </ul>
        </div>
        <div>
          <h4>Later (ideas, not committed)</h4>
          <ul>
            <li contentEditable suppressContentEditableWarning className="ex">
              [Add item]
            </li>
            <li contentEditable suppressContentEditableWarning className="ex">
              [Add item]
            </li>
          </ul>
        </div>
      </div>
      <h3>Timeline</h3>
      <p className="hint">Edit the headers (weeks, months or quarters) and row labels to match your plan.</p>
      <div className="table-wrap">
        <table className="gantt" id="gantt" ref={ganttRef} onClick={toggleCell} onDoubleClick={toggleMilestone}>
          <tbody>
            <tr>
              <th>Workstream</th>
              <th contentEditable suppressContentEditableWarning>
                Month 1
              </th>
              <th contentEditable suppressContentEditableWarning>
                Month 2
              </th>
              <th contentEditable suppressContentEditableWarning>
                Month 3
              </th>
              <th contentEditable suppressContentEditableWarning>
                Month 4
              </th>
              <th contentEditable suppressContentEditableWarning>
                Month 5
              </th>
              <th contentEditable suppressContentEditableWarning>
                Month 6
              </th>
            </tr>
            <tr>
              <td className="lbl" contentEditable suppressContentEditableWarning>
                Feature / workstream
              </td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
            </tr>
            <tr>
              <td className="lbl" contentEditable suppressContentEditableWarning>
                Feature / workstream
              </td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
            </tr>
            <tr>
              <td className="lbl" contentEditable suppressContentEditableWarning>
                Feature / workstream
              </td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
            </tr>
            <tr>
              <td className="lbl" contentEditable suppressContentEditableWarning>
                Feature / workstream
              </td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
            </tr>
            <tr>
              <td className="lbl" contentEditable suppressContentEditableWarning>
                Feature / workstream
              </td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
            </tr>
            <tr>
              <td className="lbl" contentEditable suppressContentEditableWarning>
                Milestones
              </td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
              <td className="gt"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="hint" contentEditable suppressContentEditableWarning>
        Milestones: <span className="ex">(key dates marked ◆ above, e.g. beta, launch)</span>
      </p>
      <button className="small" onClick={addGanttRow}>
        + Add workstream row
      </button>

      <h2 id="s11">11. Dependencies &amp; Risks</h2>
      <p className="purpose">
        <b>What this is:</b> things outside the team's control that you rely on (dependencies), and things that could go
        wrong (risks), each with a plan and an owner.
      </p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Description</th>
              <th>Impact</th>
              <th>Likelihood</th>
              <th>Mitigation</th>
              <th>Owner</th>
            </tr>
            <tr>
              <td>R1</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Risk / Dependency
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                H / M / L
              </td>
              <td contentEditable suppressContentEditableWarning className="ex">
                H / M / L
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td>R2</td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Risk / Dependency
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                H / M / L
              </td>
              <td contentEditable suppressContentEditableWarning className="ex">
                H / M / L
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="s12">12. Open Questions &amp; Decisions Log</h2>
      <p className="purpose">
        <b>What this is:</b> a running record. Questions are things nobody has answered yet; decisions are what was
        settled, by whom and why, so the team does not reopen them later.
      </p>
      <h3>Open questions</h3>
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
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Question / Blocker
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Open
              </td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
            <tr>
              <td>Q2</td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Question / Blocker
              </td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex">
                Open
              </td>
              <td contentEditable suppressContentEditableWarning></td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>Decisions</h3>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>#</th>
              <th>Decision</th>
              <th>Reasoning</th>
              <th>Decided by</th>
              <th>Date</th>
            </tr>
            <tr>
              <td>D1</td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="s13">13. Glossary</h2>
      <p className="purpose">
        <b>What this is:</b> short definitions of project terms and abbreviations, so everyone uses the same words for
        the same things.
      </p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th style={{ width: '30%' }}>Term</th>
              <th>Definition</th>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="s14">14. Revision History</h2>
      <p className="purpose">
        <b>What this is:</b> a short log of what changed in this document, when and by whom.
      </p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>Version</th>
              <th>Date</th>
              <th>Author</th>
              <th>Change</th>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
            <tr>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
              <td contentEditable suppressContentEditableWarning className="ex"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

// never re-render: the live document belongs to whoever is editing it
export default memo(ProjectPrdTemplate, () => true);
